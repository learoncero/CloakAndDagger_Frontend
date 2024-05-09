type Props = {
    handleVoting: () => void;
};

export default function ChatSendButton({ handleVoting }: Props) {
    return (
        <button
            type="button"
            onClick={handleVoting}
            className="bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg"
        >
            Vote
        </button>
    );
};
