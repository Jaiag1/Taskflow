import { Task } from "@shared/schema";

const TASKS_KEY = "taskmaster_tasks";

export const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
    return [];
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
};

export const clearTasksFromStorage = (): void => {
  try {
    localStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error("Failed to clear tasks from localStorage:", error);
  }
};
