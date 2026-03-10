import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Task } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import TaskForm from "@/components/task-form";
import TaskStats from "@/components/task-stats";
import TaskList from "@/components/task-list";
import EditTaskDialog from "@/components/edit-task-dialog";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { getFilteredTasks } from "@/lib/date-utils";
import { Search, X, Sun, Moon } from "lucide-react";

type ViewType = "all" | "today" | "week";
type CategoryType = "work" | "personal" | "shopping" | "fitness" | null;

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>("all");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const { theme, setTheme } = useTheme();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const filteredTasks = getFilteredTasks(tasks, activeView, selectedCategory, searchTerm);
  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setSelectedCategory(null);
  };

  const handleCategoryFilter = (category: CategoryType) => {
    setSelectedCategory(category);
    setActiveView("all");
  };

  const getViewTitle = () => {
    if (selectedCategory) {
      return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    }
    switch (activeView) {
      case "today":
        return "Today";
      case "week":
        return "Next 7 Days";
      default:
        return "All Tasks";
    }
  };

  const getViewSubtitle = () => {
    if (selectedCategory) {
      return `Tasks in ${selectedCategory} category`;
    }
    switch (activeView) {
      case "today":
        return "Tasks due today";
      case "week":
        return "Tasks due in the next 7 days";
      default:
        return "Manage all your tasks in one place";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-lg text-foreground">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        tasks={tasks}
        activeView={activeView}
        selectedCategory={selectedCategory}
        onViewChange={handleViewChange}
        onCategoryFilter={handleCategoryFilter}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{getViewTitle()}</h2>
              <p className="text-sm text-muted-foreground">{getViewSubtitle()}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-64 bg-background text-foreground placeholder:text-muted-foreground"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle dark mode"
                id="dark-mode-toggle"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <TaskForm />
          <TaskStats tasks={filteredTasks} />
          <TaskList
            activeTasks={activeTasks}
            completedTasks={completedTasks}
            onEditTask={setEditingTask}
            onDeleteTask={setDeletingTask}
          />
        </main>
      </div>

      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      />

      <DeleteConfirmationDialog
        task={deletingTask}
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
      />
    </div>
  );
}
