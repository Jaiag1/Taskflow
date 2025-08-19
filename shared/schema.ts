import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = ["work", "personal", "shopping", "fitness"] as const;

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  dueDate: text("due_date"),
  priority: boolean("priority").default(false),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
}).extend({
  title: z.string().min(1, "Task title is required"),
  category: z.enum(categories, { required_error: "Category is required" }),
  dueDate: z.string().optional(),
  priority: z.boolean().default(false),
  completed: z.boolean().default(false),
});

export const updateTaskSchema = insertTaskSchema.partial().extend({
  id: z.string(),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type Category = typeof categories[number];
