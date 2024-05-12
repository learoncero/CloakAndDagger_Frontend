import React from "react";

type Props = {
    title: string;
    completedInstances: number;
    totalInstances: number;
};

export default function TaskListItem({ title, completedInstances, totalInstances }: Props) {
    const isAllCompleted = completedInstances === totalInstances;

    return (
        <li className="bg-gray-700 bg-opacity-70 rounded-md p-2 mb-2">
            {isAllCompleted ? (
                <span className="block font-semibold text-green-500"> {title} ({completedInstances}/{totalInstances}) ✅ </span>
            ) : (
                <span className="block font-semibold">{title} ({completedInstances}/{totalInstances})</span>
            )}
        </li>
    );
}
