type Props = {
    onClick: () => void;
};

export default function ChatSendButton({ onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg"
        >
            Vote
        </button>
    );
};
