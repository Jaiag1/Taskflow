import { useState } from "react";
import { Task } from "@shared/schema";
import TaskItem from "./task-item";
import { CheckCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskListProps {
  activeTasks: Task[];
  completedTasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export default function TaskList({
  activeTasks,
  completedTasks,
  onEditTask,
  onDeleteTask,
}: TaskListProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="space-y-4">
      {/* Active Tasks */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Active Tasks</h3>
          <span className="text-sm text-muted-foreground">
            {activeTasks.length} {activeTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {activeTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-border" />
            <p>No active tasks found</p>
            <p className="text-sm">Create a new task to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-between w-full mb-4 text-left"
          >
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="text-success h-5 w-5" />
              Completed Tasks
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-400 transform transition-transform",
                  showCompleted && "rotate-180"
                )}
              />
            </div>
          </button>

          {showCompleted && (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
