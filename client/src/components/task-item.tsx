import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Calendar, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isPast, parseISO } from "date-fns";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const categoryStyles = {
  work: "bg-blue-100 text-blue-800",
  personal: "bg-green-100 text-green-800",
  shopping: "bg-purple-100 text-purple-800",
  fitness: "bg-orange-100 text-orange-800",
};

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const response = await apiRequest("PUT", `/api/tasks/${task.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const toggleComplete = () => {
    updateTaskMutation.mutate({ completed: !task.completed });
  };

  const handleInlineEdit = () => {
    if (isEditing && editTitle.trim() !== task.title) {
      updateTaskMutation.mutate({ title: editTitle.trim() });
    } else {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInlineEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const getTaskStatus = () => {
    if (!task.dueDate) return null;
    
    const dueDate = parseISO(task.dueDate);
    if (isPast(dueDate) && !isToday(dueDate) && !task.completed) {
      return { type: 'overdue', label: 'Overdue', icon: AlertTriangle };
    } else if (isToday(dueDate) && !task.completed) {
      return { type: 'today', label: 'Due Today', icon: Clock };
    }
    return null;
  };

  const taskStatus = getTaskStatus();

  const taskItemClasses = cn(
    "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200",
    taskStatus?.type === 'overdue' && "border-l-4 border-l-red-500 bg-red-50",
    taskStatus?.type === 'today' && "border-l-4 border-l-yellow-500 bg-yellow-50",
    task.completed && "opacity-60"
  );

  return (
    <div className={taskItemClasses}>
      <div className="flex items-center gap-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={toggleComplete}
          disabled={updateTaskMutation.isPending}
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleInlineEdit}
                onKeyDown={handleKeyPress}
                className="h-8 text-sm"
                autoFocus
              />
            ) : (
              <span
                onClick={() => !task.completed && setIsEditing(true)}
                className={cn(
                  "font-medium cursor-pointer hover:text-primary",
                  task.completed ? "text-gray-600 line-through" : "text-gray-900"
                )}
              >
                {task.title}
              </span>
            )}
            
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                categoryStyles[task.category],
                task.completed && "opacity-60"
              )}
            >
              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </span>
            
            {task.priority && !task.completed && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                High Priority
              </span>
            )}
            
            {taskStatus && (
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                taskStatus.type === 'overdue' ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
              )}>
                <taskStatus.icon className="h-3 w-3 inline mr-1" />
                {taskStatus.label}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(parseISO(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            {task.completed && task.completedAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Completed {format(new Date(task.completedAt), 'MMM d')}
              </span>
            )}
            {!task.completed && task.createdAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Created {format(new Date(task.createdAt), 'MMM d')}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!task.completed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task)}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
