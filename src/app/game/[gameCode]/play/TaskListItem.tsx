type Props = {
  task: string;
};

export default function TaskListItem({ task }: Props) {
  return (
    <li className="bg-gray-700 bg-opacity-70 rounded-md p-2 mb-2">
      <span className="block font-semibold">{task}</span>
      <p className="text-xs">Here comes the description.</p>
    </li>
  );
}
