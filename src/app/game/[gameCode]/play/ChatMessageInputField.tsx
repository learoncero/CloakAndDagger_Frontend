type Props = {
  updateMessage: (message: string) => void;
  message: string;
  onMessageSend: () => void;
};

export default function ChatMessageInputField({
  updateMessage,
  message,
  onMessageSend,
}: Props) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateMessage(event.target.value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line
      onMessageSend(); // Trigger onMessageSend function when Enter is pressed
    }
  }

  return (
    <div className="flex-grow">
      <input
        type="text"
        name="message"
        placeholder="Type a message..."
        max={100}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={message}
        className="bg-transparent text-white min-h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full"
      />
    </div>
  );
}
