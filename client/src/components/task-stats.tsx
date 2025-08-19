import { Task } from "@shared/schema";
import { CheckCircle, Clock, AlertTriangle, List } from "lucide-react";
import { getTodayTasks, getOverdueTasks } from "@/lib/date-utils";

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const todayTasks = getTodayTasks(tasks);
  const overdueTasks = getOverdueTasks(tasks);

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: List,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Completed",
      value: completedTasks.length,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Due Today",
      value: todayTasks.length,
      icon: Clock,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "Overdue",
      value: overdueTasks.length,
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
