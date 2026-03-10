import { Task, Category } from "@shared/schema";
import { isToday, isAfter, isBefore, addDays, parseISO, startOfDay } from "date-fns";

export const getTodayTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return isToday(parseISO(task.dueDate));
  });
};

export const getWeekTasks = (tasks: Task[]): Task[] => {
  const now = new Date();
  const weekFromNow = addDays(now, 7);
  
  return tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = parseISO(task.dueDate);
    return isAfter(dueDate, startOfDay(now)) && isBefore(dueDate, weekFromNow);
  });
};

export const getOverdueTasks = (tasks: Task[]): Task[] => {
  const today = startOfDay(new Date());
  
  return tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = parseISO(task.dueDate);
    return isBefore(dueDate, today);
  });
};

export const getTaskCountByCategory = (tasks: Task[]): Record<Category, number> => {
  const counts: Record<Category, number> = {
    work: 0,
    personal: 0,
    shopping: 0,
    fitness: 0,
  };

  tasks.forEach(task => {
    if (!task.completed && task.category in counts) {
      counts[task.category as Category]++;
    }
  });

  return counts;
};

export const getFilteredTasks = (
  tasks: Task[],
  view: "all" | "today" | "week",
  category: Category | null,
  searchTerm: string
): Task[] => {
  let filtered = [...tasks];

  // Filter by view
  if (view === "today") {
    filtered = getTodayTasks(filtered);
  } else if (view === "week") {
    filtered = getWeekTasks(filtered);
  }

  // Filter by category
  if (category) {
    filtered = filtered.filter(task => task.category === category);
  }

  // Filter by search term — each space-separated word must prefix-match a token
  // in the task title, category, or due date. This means "grocery" matches
  // "groceries" and "quarter" matches "quarterly", but "pl" won't match "complete".
  if (searchTerm.trim()) {
    const words = searchTerm.trim().toLowerCase().split(/\s+/);
    filtered = filtered.filter(task => {
      const haystack = [
        task.title,
        task.category,
        task.dueDate ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const tokens = haystack.split(/\W+/);
      // Every search word must be a prefix of at least one token in the haystack
      return words.every(word =>
        tokens.some(token => token.startsWith(word))
      );
    });
  }

  return filtered;
};
