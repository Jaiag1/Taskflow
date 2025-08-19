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

  // Filter by search term
  if (searchTerm.trim()) {
    const search = searchTerm.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(search) ||
      task.category.toLowerCase().includes(search)
    );
  }

  return filtered;
};
