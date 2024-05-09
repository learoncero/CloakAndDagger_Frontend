type Props = {
    handleVotes: (selectedPlayerId: string) => void;
    selectedPlayerId: string;
};

export default function ChatSendButton({ handleVotes, selectedPlayerId }: Props) {
    return (
        <button
            type="button"
            onClick={() => handleVotes(selectedPlayerId)}
            className="bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg"
        >
            Vote
        </button>
    );
};
