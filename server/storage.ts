import { 
  users, 
  focusSessions,
  screenTimeEntries,
  healthMetrics,
  friendships,
  dailyStats,
  type User, 
  type InsertUser,
  type FocusSession,
  type InsertFocusSession,
  type ScreenTimeEntry,
  type InsertScreenTimeEntry,
  type HealthMetric,
  type InsertHealthMetric,
  type Friendship,
  type InsertFriendship,
  type DailyStat,
  type InsertDailyStat
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Focus Sessions
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;
  updateFocusSession(id: number, updates: Partial<FocusSession>): Promise<FocusSession | undefined>;
  getUserFocusSessions(userId: number, startDate: Date, endDate: Date): Promise<FocusSession[]>;
  
  // Screen Time
  createScreenTimeEntry(entry: InsertScreenTimeEntry): Promise<ScreenTimeEntry>;
  getUserScreenTime(userId: number, date: Date): Promise<ScreenTimeEntry[]>;
  getUserScreenTimeByHour(userId: number, date: Date): Promise<{ hour: number; minutes: number }[]>;
  
  // Health Metrics
  createOrUpdateHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  getUserHealthMetric(userId: number, date: Date): Promise<HealthMetric | undefined>;
  
  // Friends
  createFriendship(friendship: InsertFriendship): Promise<Friendship>;
  getUserFriends(userId: number): Promise<User[]>;
  getLeaderboard(userId: number, limit?: number): Promise<Array<User & { score: number; rank: number }>>;
  
  // Daily Stats
  createOrUpdateDailyStat(stat: InsertDailyStat): Promise<DailyStat>;
  getUserDailyStat(userId: number, date: Date): Promise<DailyStat | undefined>;
  getUserStreak(userId: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values([insertUser])
      .returning();
    return user;
  }

  // Focus Sessions
  async createFocusSession(session: InsertFocusSession): Promise<FocusSession> {
    const [newSession] = await db
      .insert(focusSessions)
      .values([session])
      .returning();
    return newSession;
  }

  async updateFocusSession(id: number, updates: Partial<FocusSession>): Promise<FocusSession | undefined> {
    const [updated] = await db
      .update(focusSessions)
      .set(updates)
      .where(eq(focusSessions.id, id))
      .returning();
    return updated || undefined;
  }

  async getUserFocusSessions(userId: number, startDate: Date, endDate: Date): Promise<FocusSession[]> {
    return await db
      .select()
      .from(focusSessions)
      .where(
        and(
          eq(focusSessions.userId, userId),
          gte(focusSessions.startedAt, startDate),
          lte(focusSessions.startedAt, endDate)
        )
      )
      .orderBy(desc(focusSessions.startedAt));
  }

  // Screen Time
  async createScreenTimeEntry(entry: InsertScreenTimeEntry): Promise<ScreenTimeEntry> {
    const [newEntry] = await db
      .insert(screenTimeEntries)
      .values([entry])
      .returning();
    return newEntry;
  }

  async getUserScreenTime(userId: number, date: Date): Promise<ScreenTimeEntry[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db
      .select()
      .from(screenTimeEntries)
      .where(
        and(
          eq(screenTimeEntries.userId, userId),
          gte(screenTimeEntries.date, startOfDay),
          lte(screenTimeEntries.date, endOfDay)
        )
      );
  }

  async getUserScreenTimeByHour(userId: number, date: Date): Promise<{ hour: number; minutes: number }[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const results = await db
      .select({
        hour: screenTimeEntries.hour,
        minutes: sql<number>`SUM(${screenTimeEntries.durationMinutes})`.as('total_minutes')
      })
      .from(screenTimeEntries)
      .where(
        and(
          eq(screenTimeEntries.userId, userId),
          gte(screenTimeEntries.date, startOfDay),
          lte(screenTimeEntries.date, endOfDay)
        )
      )
      .groupBy(screenTimeEntries.hour);

    return results.map(r => ({ hour: r.hour, minutes: Number(r.minutes) || 0 }));
  }

  // Health Metrics
  async createOrUpdateHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric> {
    const typedMetric = metric as InsertHealthMetric & { userId: number; date: Date };
    const existing = await this.getUserHealthMetric(typedMetric.userId, typedMetric.date);
    
    if (existing) {
      const [updated] = await db
        .update(healthMetrics)
        .set(metric)
        .where(eq(healthMetrics.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newMetric] = await db
        .insert(healthMetrics)
        .values([metric])
        .returning();
      return newMetric;
    }
  }

  async getUserHealthMetric(userId: number, date: Date): Promise<HealthMetric | undefined> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [metric] = await db
      .select()
      .from(healthMetrics)
      .where(
        and(
          eq(healthMetrics.userId, userId),
          gte(healthMetrics.date, startOfDay),
          lte(healthMetrics.date, endOfDay)
        )
      );
    return metric || undefined;
  }

  // Friends
  async createFriendship(friendship: InsertFriendship): Promise<Friendship> {
    const [newFriendship] = await db
      .insert(friendships)
      .values([friendship])
      .returning();
    return newFriendship;
  }

  async getUserFriends(userId: number): Promise<User[]> {
    const results = await db
      .select({
        id: users.id,
        username: users.username,
        password: users.password,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })
      .from(friendships)
      .innerJoin(users, eq(friendships.friendId, users.id))
      .where(
        and(
          eq(friendships.userId, userId),
          eq(friendships.status, 'accepted')
        )
      );
    
    return results;
  }

  async getLeaderboard(userId: number, limit: number = 10): Promise<Array<User & { score: number; rank: number }>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get friends + self
    const friendIds = await db
      .select({ friendId: friendships.friendId })
      .from(friendships)
      .where(
        and(
          eq(friendships.userId, userId),
          eq(friendships.status, 'accepted')
        )
      );

    const userIds = [userId, ...friendIds.map(f => f.friendId)];

    const results = await db
      .select({
        id: users.id,
        username: users.username,
        password: users.password,
        avatar: users.avatar,
        createdAt: users.createdAt,
        score: sql<number>`COALESCE(${dailyStats.focusScore}, 0)`.as('score')
      })
      .from(users)
      .leftJoin(
        dailyStats,
        and(
          eq(users.id, dailyStats.userId),
          gte(dailyStats.date, today)
        )
      )
      .where(sql`${users.id} IN ${userIds}`)
      .orderBy(desc(sql`COALESCE(${dailyStats.focusScore}, 0)`))
      .limit(limit);

    return results.map((r, index) => ({
      ...r,
      score: Number(r.score) || 0,
      rank: index + 1
    }));
  }

  // Daily Stats
  async createOrUpdateDailyStat(stat: InsertDailyStat): Promise<DailyStat> {
    const typedStat = stat as InsertDailyStat & { userId: number; date: Date };
    const existing = await this.getUserDailyStat(typedStat.userId, typedStat.date);
    
    if (existing) {
      const [updated] = await db
        .update(dailyStats)
        .set(stat)
        .where(eq(dailyStats.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newStat] = await db
        .insert(dailyStats)
        .values([stat])
        .returning();
      return newStat;
    }
  }

  async getUserDailyStat(userId: number, date: Date): Promise<DailyStat | undefined> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [stat] = await db
      .select()
      .from(dailyStats)
      .where(
        and(
          eq(dailyStats.userId, userId),
          gte(dailyStats.date, startOfDay),
          lte(dailyStats.date, endOfDay)
        )
      );
    return stat || undefined;
  }

  async getUserStreak(userId: number): Promise<number> {
    const stats = await db
      .select()
      .from(dailyStats)
      .where(eq(dailyStats.userId, userId))
      .orderBy(desc(dailyStats.date))
      .limit(30);

    if (stats.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const stat of stats) {
      const statDate = new Date(stat.date);
      statDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);
      
      if (statDate.getTime() === expectedDate.getTime() && stat.focusScore >= 50) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}

export const storage = new DatabaseStorage();
