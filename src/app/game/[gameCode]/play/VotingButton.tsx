type Props = {
    onClick: () => void;
    selectedPlayerId: number;
};

export default function VotingButton({ onClick, selectedPlayerId }: Props) {
    const disabled = (selectedPlayerId === -1);
    return (
        <button
            type="button"
            onClick={onClick}
            className={`bg-transparent border font-bold py-2 px-4 rounded-lg ${disabled ? "bg-gray-500 cursor-default border-gray-500 text-gray-500" : "hover:border-black hover:bg-cyan-500 text-white border-white"}`}
        >
            Vote
        </button>
    );
};
