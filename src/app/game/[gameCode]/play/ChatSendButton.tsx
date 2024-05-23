type Props = {
  onMessageSend: () => void;
  disabled: boolean;
};

export default function ChatSendButton({ onMessageSend, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onMessageSend}
      className="bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg"
      disabled={disabled}
    >
      Send
    </button>
  );
}
