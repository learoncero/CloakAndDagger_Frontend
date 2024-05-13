import React from "react";
import TaskListItem from "./TaskListItem";
import { Task } from "@/app/types";
import ProgressBar from "@/components/ProgressBar";

type Props = {
  tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
  const taskGroups = tasks.reduce((acc, task) => {
    if (!acc[task.title]) {
      acc[task.title] = [];
    }
    acc[task.title].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const taskInstances = Object.entries(taskGroups).map(([title, tasks]) => ({
    title,
    completedInstances: tasks.filter((task) => task.completed).length,
    totalInstances: tasks.length,
  }));

  const totalCompletedInstances = taskInstances.reduce(
    (acc, { completedInstances }) => acc + completedInstances,
    0
  );

  const totalInstances = taskInstances.reduce(
    (acc, { totalInstances }) => acc + totalInstances,
    0
  );

  const progress =
    totalInstances === 0 ? 0 : (totalCompletedInstances / totalInstances) * 100;

  return (
    <div className="bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-lg min-h-64 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">
        List of Tasks ({totalCompletedInstances}/{totalInstances})
      </h2>
      <ProgressBar progress={progress} />
      <ul>
        {taskInstances.map(({ title, completedInstances, totalInstances }) => (
          <TaskListItem
            key={title}
            title={title}
            description={taskGroups[title][0].description}
            completedInstances={completedInstances}
            totalInstances={totalInstances}
          />
        ))}
      </ul>
    </div>
  );
}
