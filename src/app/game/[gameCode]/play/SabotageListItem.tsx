import { Sabotage } from "@/app/types";
import ActionButton from "@/components/ActionButton";

type Props = {
  sabotage: Sabotage;
    onActivation(): void;
};

export default function SabotageListItem({ sabotage, onActivation }: Props) {
  return (
    <li className="bg-gray-700 bg-opacity-70 rounded-md p-2 mb-2">
      <p className="block font-semibold text-base">{sabotage.title}</p>
      <p className="text-s mb-3">{sabotage.description}</p>
        <button
            className={`px-3 py-1 rounded-md text-black font-semibold bg-cyan-500 cursor-default hover:bg-cyan-600 hover:cursor-pointer`}
            onClick={onActivation}
        >
            Activate
        </button>
    </li>
  );
}
