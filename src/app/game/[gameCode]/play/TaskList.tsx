import React from "react";
import TaskListItem from "./TaskListItem";

export default function TaskList() {
  const tasks = [
    "Repair PC",
    "Download Data",
    "Calibrate Motors",
    "Scann Cards",
  ];

  return (
    <div className="bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-lg min-h-64 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">List of Tasks</h2>
      <ul>
        {tasks.map((task, index) => (
          <TaskListItem key={index} task={task} />
        ))}
      </ul>
    </div>
  );
}
