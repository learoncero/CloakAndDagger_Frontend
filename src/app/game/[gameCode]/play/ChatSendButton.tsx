type Props = {
  onMessageSend: () => void;
  disabled: boolean;
};

export default function ChatSendButton({ onMessageSend, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onMessageSend}
      className={`bg-transparent border font-bold py-2 px-4 rounded-lg ${disabled ? "bg-gray-500 cursor-default border-gray-500 text-gray-500" : "border-white hover:border-black hover:bg-cyan-500 text-white"}`}
      disabled={disabled}
    >
      Send
    </button>
  );
}
