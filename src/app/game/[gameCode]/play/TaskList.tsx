import React from "react";
import TaskListItem from "./TaskListItem";
import {Task} from "@/app/types";

type Props = {
    tasks: Task[];
}

export default function TaskList({tasks} : Props) {
  //console.log("Tasks in TaskList:", tasks);
  return (
    <div className="bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-lg min-h-64 min-w-80 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">List of Tasks</h2>
      <ul>
        {tasks.map((task, index) => (
          <TaskListItem key={index} task={task} />
        ))}
      </ul>
    </div>
  );
}
