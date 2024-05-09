import React from "react";
import TaskListItem from "./TaskListItem";
import { Task } from "@/app/types";
import ProgressBar from "@/components/ProgressBar";

type Props = {
  tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  return (
    <div className="bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-lg min-h-64 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">List of Tasks</h2>
      <ProgressBar progress={progress} />
      <ul>
        {tasks.map((task, index) => (
          <TaskListItem key={index} task={task} />
        ))}
      </ul>
    </div>
  );
}
