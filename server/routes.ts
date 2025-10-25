import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to generate referral code
  function generateReferralCode(username: string): string {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const userPart = username.substring(0, 3).toUpperCase();
    return `${userPart}${randomPart}`;
  }

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const signupSchema = insertUserSchema.extend({
        dailyScreenTimeGoal: z.number().optional(),
        dailyStepGoal: z.number().optional(),
        activeMinutesGoal: z.number().optional(),
        problems: z.array(z.string()).optional(),
        referralCode: z.string().optional(),
      });

      const data = signupSchema.parse(req.body);
      
      // Check if username already exists
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if referral code is valid (if provided)
      let referredBy: number | undefined;
      if (data.referralCode) {
        const referrer = await storage.getUserByReferralCode(data.referralCode);
        if (referrer) {
          referredBy = referrer.id;
        }
      }

      // Hash password (simple hash for demo - in production use bcrypt)
      const hashedPassword = Buffer.from(data.password).toString('base64');
      
      // Generate unique referral code for this user
      const userReferralCode = generateReferralCode(data.username);
      
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
        referralCode: userReferralCode,
        referredBy,
      });

      // Set session
      (req.session as any).userId = user.id;

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Simple hash comparison
      const hashedPassword = Buffer.from(password).toString('base64');
      if (user.password !== hashedPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      (req.session as any).userId = user.id;

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
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

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
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
      });

      const data = updateSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(userId, data);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Update user error:", error);
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
      
      // Return users without passwords
      const usersWithoutPasswords = referredUsers.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Get referred users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/referrals/validate", async (req, res) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Referral code required" });
      }

      const referrer = await storage.getUserByReferralCode(code);
      
      if (!referrer) {
        return res.status(404).json({ message: "Invalid referral code" });
      }

      // Return basic info about the referrer
      res.json({ 
        valid: true, 
        referrerName: referrer.name || referrer.username 
      });
    } catch (error) {
      console.error("Validate referral code error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
