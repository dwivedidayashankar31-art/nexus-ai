import { db } from "./db";
import { customers, tickets, agentActions, users, type InsertCustomer, type InsertTicket, type InsertAgentAction, type InsertUser, type User } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCustomers(): Promise<typeof customers.$inferSelect[]>;
  getCustomer(id: number): Promise<typeof customers.$inferSelect | undefined>;
  getTickets(): Promise<typeof tickets.$inferSelect[]>;
  createTicket(ticket: InsertTicket): Promise<typeof tickets.$inferSelect>;
  getActions(): Promise<typeof agentActions.$inferSelect[]>;
  createAction(action: InsertAgentAction): Promise<typeof agentActions.$inferSelect>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getCustomers() {
    return await db.select().from(customers);
  }
  async getCustomer(id: number) {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }
  async getTickets() {
    return await db.select().from(tickets);
  }
  async createTicket(ticket: InsertTicket) {
    const [newTicket] = await db.insert(tickets).values(ticket).returning();
    return newTicket;
  }
  async getActions() {
    return await db.select().from(agentActions);
  }
  async createAction(action: InsertAgentAction) {
    const [newAction] = await db.insert(agentActions).values(action).returning();
    return newAction;
  }
  async getUserById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(user: InsertUser) {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
}

export const storage = new DatabaseStorage();
