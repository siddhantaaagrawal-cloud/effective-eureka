import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to generate unique 14-digit code
  function generate14DigitCode(): string {
    let code = '';
    for (let i = 0; i < 14; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  }

  // Helper function to check if user code is expired (30 days of inactivity)
  function isCodeExpired(lastActivity: Date): boolean {
    const now = new Date();
    const diffInDays = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays > 30;
  }

  // Create new user - generates a unique 14-digit code
  app.post("/api/auth/create", async (req, res) => {
    try {
      const createSchema = z.object({
        dailyScreenTimeGoal: z.number().optional(),
        dailyStepGoal: z.number().optional(),
        activeMinutesGoal: z.number().optional(),
        problems: z.array(z.string()).optional(),
        friendCode: z.string().length(14).optional(),
      });

      const data = createSchema.parse(req.body);
      
      // Generate unique 14-digit code
      let userCode = generate14DigitCode();
      let existing = await storage.getUserByCode(userCode);
      
      // Ensure code is unique
      while (existing) {
        userCode = generate14DigitCode();
        existing = await storage.getUserByCode(userCode);
      }

      // Check if friend code is valid (if provided)
      let referredBy: number | undefined;
      if (data.friendCode) {
        const friend = await storage.getUserByCode(data.friendCode);
        if (friend && !isCodeExpired(friend.lastActivity)) {
          referredBy = friend.id;
        }
      }

      const user = await storage.createUser({
        userCode,
        dailyScreenTimeGoal: data.dailyScreenTimeGoal,
        dailyStepGoal: data.dailyStepGoal,
        activeMinutesGoal: data.activeMinutesGoal,
        problems: data.problems,
        referredBy,
      });

      // If a valid friend code was provided, create friendship
      if (referredBy) {
        await storage.createFriendship({
          userId: user.id,
          friendId: referredBy,
          status: 'accepted',
        });
        
        // Create reverse friendship
        await storage.createFriendship({
          userId: referredBy,
          friendId: user.id,
          status: 'accepted',
        });
      }

      // Set session
      (req.session as any).userId = user.id;

      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Create user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login with 14-digit code
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { code } = req.body;

      if (!code || code.length !== 14) {
        return res.status(400).json({ message: "14-digit code required" });
      }

      const user = await storage.getUserByCode(code);
      if (!user) {
        return res.status(401).json({ message: "Invalid code" });
      }

      // Check if code is expired (30 days of inactivity)
      if (isCodeExpired(user.lastActivity)) {
        return res.status(401).json({ message: "Code expired due to 30 days of inactivity" });
      }

      // Update last activity
      await storage.updateUserActivity(user.id);

      // Set session
      (req.session as any).userId = user.id;

      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Update last activity
      await storage.updateUserActivity(user.id);

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // User update route for completing onboarding
  app.patch("/api/users/me", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const updateSchema = z.object({
        dailyScreenTimeGoal: z.number().optional(),
        dailyStepGoal: z.number().optional(),
        activeMinutesGoal: z.number().optional(),
        problems: z.array(z.string()).optional(),
        onboardingCompleted: z.boolean().optional(),
        avatar: z.string().optional(),
        name: z.string().optional(),
      });

      const data = updateSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(userId, data);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Update user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Friends routes
  app.get("/api/friends", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const friends = await storage.getUserFriends(userId);
      res.json(friends);
    } catch (error) {
      console.error("Get friends error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/friends/add", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { code } = req.body;

      if (!code || code.length !== 14) {
        return res.status(400).json({ message: "14-digit code required" });
      }

      const friend = await storage.getUserByCode(code);
      if (!friend) {
        return res.status(404).json({ message: "User not found" });
      }

      if (friend.id === userId) {
        return res.status(400).json({ message: "Cannot add yourself as a friend" });
      }

      // Check if code is expired
      if (isCodeExpired(friend.lastActivity)) {
        return res.status(400).json({ message: "This user's code has expired due to inactivity" });
      }

      // Check if already friends
      const existingFriends = await storage.getUserFriends(userId);
      if (existingFriends.some(f => f.id === friend.id)) {
        return res.status(400).json({ message: "Already friends with this user" });
      }

      // Create friendship (both directions)
      await storage.createFriendship({
        userId: userId,
        friendId: friend.id,
        status: 'accepted',
      });

      await storage.createFriendship({
        userId: friend.id,
        friendId: userId,
        status: 'accepted',
      });

      res.json(friend);
    } catch (error) {
      console.error("Add friend error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/friends/leaderboard", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const leaderboard = await storage.getLeaderboard(userId, 50);
      res.json(leaderboard);
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Stats routes
  app.get("/api/stats/daily", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats = await storage.getUserDailyStat(userId, today);
      res.json(stats || { focusScore: 0, wellnessScore: 0, screenTimeMinutes: 0, focusSessionsCompleted: 0, streak: 0 });
    } catch (error) {
      console.error("Get daily stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/stats/streak", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const streak = await storage.getUserStreak(userId);
      res.json(streak);
    } catch (error) {
      console.error("Get streak error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Focus sessions routes
  app.get("/api/focus-sessions", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      const sessions = await storage.getUserFocusSessions(userId, startDate, endDate);
      res.json(sessions);
    } catch (error) {
      console.error("Get focus sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Referral routes
  app.get("/api/referrals/stats", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const stats = await storage.getReferralStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Get referral stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/referrals/referred-users", async (req, res) => {
    try {
      const userId = (req.session as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const referredUsers = await storage.getReferredUsers(userId);
      res.json(referredUsers);
    } catch (error) {
      console.error("Get referred users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
