import { Sabotage } from "@/app/types";

type Props = {
  sabotage: Sabotage;
  onActivate(): void;
};

export default function SabotageListItem({ sabotage, onActivate }: Props) {
  return (
    <li className="bg-gray-700 bg-opacity-70 rounded-md p-2 mb-2">
      <span className="block font-semibold">{sabotage.title}</span>
      <p className="text-xs">{sabotage.description}</p>
      <button
        className="text-xs text-blue-500 hover:underline mt-1"
        onClick={onActivate}
      >
        Complete
      </button>
    </li>
  );
}
