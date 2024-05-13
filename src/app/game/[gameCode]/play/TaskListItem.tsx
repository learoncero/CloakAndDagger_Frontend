import React from "react";

type Props = {
  title: string;
  description: string;
  completedInstances: number;
  totalInstances: number;
};

export default function TaskListItem({
  title,
  description,
  completedInstances,
  totalInstances,
}: Props) {
  const isAllCompleted = completedInstances === totalInstances;

  return (
    <li className="bg-gray-700 bg-opacity-70 rounded-md p-2 mb-2">
      {isAllCompleted ? (
        <span className="block font-semibold text-green-500">
          {" "}
          {title} ({completedInstances}/{totalInstances}) ✅{" "}
          <p className="text-xs">{description}</p>
        </span>
      ) : (
        <span className="block font-semibold">
          {title} ({completedInstances}/{totalInstances})
          <p className="text-xs">{description}</p>
        </span>
      )}
    </li>
  );
}
