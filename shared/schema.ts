import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Focus sessions table
export const focusSessions = pgTable("focus_sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionType: text("session_type").notNull(), // 'deep', 'light', 'break'
  durationMinutes: integer("duration_minutes").notNull(),
  completed: boolean("completed").notNull().default(false),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
});

// Screen time entries table
export const screenTimeEntries = pgTable("screen_time_entries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  appName: text("app_name").notNull(),
  appIcon: text("app_icon"), // Icon identifier from lucide-react
  category: text("category").notNull(), // 'distract', 'neutral', 'productive'
  durationMinutes: integer("duration_minutes").notNull(),
  date: timestamp("date").notNull(),
  hour: integer("hour").notNull(), // 0-23 for hourly breakdown
});

// Health metrics table
export const healthMetrics = pgTable("health_metrics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  steps: integer("steps").default(0),
  sleepMinutes: integer("sleep_minutes").default(0),
  activeMinutes: integer("active_minutes").default(0),
  caloriesBurned: integer("calories_burned").default(0),
});

// Friends/connections table
export const friendships = pgTable("friendships", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  friendId: integer("friend_id").notNull().references(() => users.id),
  status: text("status").notNull().default('pending'), // 'pending', 'accepted', 'blocked'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Daily stats (computed/cached)
export const dailyStats = pgTable("daily_stats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  focusScore: integer("focus_score").notNull().default(0),
  wellnessScore: integer("wellness_score").notNull().default(0),
  screenTimeMinutes: integer("screen_time_minutes").notNull().default(0),
  focusSessionsCompleted: integer("focus_sessions_completed").notNull().default(0),
  streak: integer("streak").notNull().default(0),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  focusSessions: many(focusSessions),
  screenTimeEntries: many(screenTimeEntries),
  healthMetrics: many(healthMetrics),
  friendships: many(friendships, { relationName: "userFriendships" }),
  friendOf: many(friendships, { relationName: "friendOfUser" }),
  dailyStats: many(dailyStats),
}));

export const focusSessionsRelations = relations(focusSessions, ({ one }) => ({
  user: one(users, {
    fields: [focusSessions.userId],
    references: [users.id],
  }),
}));

export const screenTimeEntriesRelations = relations(screenTimeEntries, ({ one }) => ({
  user: one(users, {
    fields: [screenTimeEntries.userId],
    references: [users.id],
  }),
}));

export const healthMetricsRelations = relations(healthMetrics, ({ one }) => ({
  user: one(users, {
    fields: [healthMetrics.userId],
    references: [users.id],
  }),
}));

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  user: one(users, {
    fields: [friendships.userId],
    references: [users.id],
    relationName: "userFriendships",
  }),
  friend: one(users, {
    fields: [friendships.friendId],
    references: [users.id],
    relationName: "friendOfUser",
  }),
}));

export const dailyStatsRelations = relations(dailyStats, ({ one }) => ({
  user: one(users, {
    fields: [dailyStats.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(1),
  password: z.string().min(6),
}).omit({
  id: true,
  createdAt: true,
});

export const insertFocusSessionSchema = createInsertSchema(focusSessions).omit({
  id: true,
});

export const insertScreenTimeEntrySchema = createInsertSchema(screenTimeEntries).omit({
  id: true,
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({
  id: true,
});

export const insertFriendshipSchema = createInsertSchema(friendships).omit({
  id: true,
  createdAt: true,
});

export const insertDailyStatSchema = createInsertSchema(dailyStats).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFocusSession = z.infer<typeof insertFocusSessionSchema>;
export type FocusSession = typeof focusSessions.$inferSelect;

export type InsertScreenTimeEntry = z.infer<typeof insertScreenTimeEntrySchema>;
export type ScreenTimeEntry = typeof screenTimeEntries.$inferSelect;

export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;

export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;
export type Friendship = typeof friendships.$inferSelect;

export type InsertDailyStat = z.infer<typeof insertDailyStatSchema>;
export type DailyStat = typeof dailyStats.$inferSelect;
