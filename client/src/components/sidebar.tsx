import { Task, Category } from "@shared/schema";
import { List, Calendar, CalendarDays, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTodayTasks, getWeekTasks, getTaskCountByCategory } from "@/lib/date-utils";

type ViewType = "all" | "today" | "week";
type CategoryType = Category | null;

interface SidebarProps {
  tasks: Task[];
  activeView: ViewType;
  selectedCategory: CategoryType;
  onViewChange: (view: ViewType) => void;
  onCategoryFilter: (category: CategoryType) => void;
}

const categoryColors = {
  work: "bg-blue-500",
  personal: "bg-green-500",
  shopping: "bg-purple-500",
  fitness: "bg-orange-500",
};

export default function Sidebar({
  tasks,
  activeView,
  selectedCategory,
  onViewChange,
  onCategoryFilter,
}: SidebarProps) {
  const todayTasks = getTodayTasks(tasks);
  const weekTasks = getWeekTasks(tasks);
  const categoryStats = getTaskCountByCategory(tasks);

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <List className="text-primary h-6 w-6" />
          TaskMaster
        </h1>
        <p className="text-sm text-gray-500 mt-1">Organize your life</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onViewChange("all")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                activeView === "all" && !selectedCategory
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <List className="h-4 w-4" />
              <span>All Tasks</span>
              <span
                className={cn(
                  "ml-auto px-2 py-1 rounded-full text-xs",
                  activeView === "all" && !selectedCategory
                    ? "bg-white bg-opacity-20 text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {tasks.length}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onViewChange("today")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                activeView === "today"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Calendar className="h-4 w-4" />
              <span>Today</span>
              <span
                className={cn(
                  "ml-auto px-2 py-1 rounded-full text-xs",
                  activeView === "today"
                    ? "bg-white bg-opacity-20 text-white"
                    : "bg-warning text-white"
                )}
              >
                {todayTasks.length}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onViewChange("week")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                activeView === "week"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <CalendarDays className="h-4 w-4" />
              <span>Next 7 Days</span>
              <span
                className={cn(
                  "ml-auto px-2 py-1 rounded-full text-xs",
                  activeView === "week"
                    ? "bg-white bg-opacity-20 text-white"
                    : "bg-blue-100 text-blue-800"
                )}
              >
                {weekTasks.length}
              </span>
            </button>
          </li>
        </ul>

        <hr className="my-4 border-gray-200" />

        {/* Categories */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Categories
          </h3>
          <ul className="space-y-1">
            {Object.entries(categoryStats).map(([category, count]) => (
              <li key={category}>
                <button
                  onClick={() => onCategoryFilter(category as Category)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      categoryColors[category as Category]
                    )}
                  />
                  <span className="capitalize">{category}</span>
                  <span
                    className={cn(
                      "ml-auto text-xs",
                      selectedCategory === category
                        ? "text-white"
                        : "text-gray-500"
                    )}
                  >
                    {count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-left rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-sm">
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
