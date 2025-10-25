import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const signupSchema = insertUserSchema.extend({
        dailyScreenTimeGoal: z.number().optional(),
        dailyStepGoal: z.number().optional(),
        activeMinutesGoal: z.number().optional(),
        problems: z.array(z.string()).optional(),
      });

      const data = signupSchema.parse(req.body);
      
      // Check if username already exists
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password (simple hash for demo - in production use bcrypt)
      const hashedPassword = Buffer.from(data.password).toString('base64');
      
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
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

  const httpServer = createServer(app);

  return httpServer;
}
