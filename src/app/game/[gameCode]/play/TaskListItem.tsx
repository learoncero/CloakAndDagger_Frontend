import { Task } from "@/app/types";

type Props = {
  task: Task;
};

export default function TaskListItem({ task }: Props) {
  return (
    <li className="bg-gray-700 bg-opacity-70 rounded-md p-2 mb-2">
      {task.completed ? (
        <span className="block font-semibold">✅{task.title}</span>
      ) : (
        <span className="block font-semibold">{task.title}</span>
      )}
      <p className="text-xs">{task.description}</p>
    </li>
  );
}
