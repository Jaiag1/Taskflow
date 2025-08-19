import { type Task, type InsertTask, type UpdateTask } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(task: UpdateTask): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;

  constructor() {
    this.tasks = new Map();
    this.seedData();
  }

  private seedData() {
    // Add some initial sample tasks for demonstration
    const sampleTasks: Task[] = [
      {
        id: "1",
        title: "Complete quarterly report",
        category: "work",
        dueDate: "2025-08-15", // Past date to show overdue
        priority: true,
        completed: false,
        createdAt: new Date("2025-08-10"),
        completedAt: null,
      },
      {
        id: "2",
        title: "Buy groceries for dinner",
        category: "shopping",
        dueDate: "2025-08-19", // Today
        priority: false,
        completed: false,
        createdAt: new Date("2025-08-18"),
        completedAt: null,
      },
      {
        id: "3",
        title: "Schedule dentist appointment",
        category: "personal",
        dueDate: "2025-08-22",
        priority: false,
        completed: false,
        createdAt: new Date("2025-08-17"),
        completedAt: null,
      },
      {
        id: "4",
        title: "Go for 30-minute run",
        category: "fitness",
        dueDate: "2025-08-20",
        priority: false,
        completed: false,
        createdAt: new Date("2025-08-19"),
        completedAt: null,
      },
      {
        id: "5",
        title: "Update website homepage",
        category: "work",
        dueDate: "2025-08-17",
        priority: false,
        completed: true,
        createdAt: new Date("2025-08-15"),
        completedAt: new Date("2025-08-17"),
      },
    ];

    sampleTasks.forEach(task => this.tasks.set(task.id, task));
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    });
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date(),
      completedAt: null,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(updateTask: UpdateTask): Promise<Task> {
    const existingTask = this.tasks.get(updateTask.id!);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updateTask,
      completedAt: updateTask.completed && !existingTask.completed 
        ? new Date() 
        : !updateTask.completed 
          ? null 
          : existingTask.completedAt,
    };

    this.tasks.set(updateTask.id!, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
