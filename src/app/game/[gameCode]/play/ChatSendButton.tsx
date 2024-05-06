type Props = {
  onMessageSend: () => void;
};

export default function ChatSendButton({ onMessageSend }: Props) {
  return (
    <button
      type="button"
      onClick={onMessageSend}
      className="bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg"
    >
      Send
    </button>
  );
}
