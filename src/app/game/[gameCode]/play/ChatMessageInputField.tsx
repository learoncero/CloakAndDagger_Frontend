type Props = {
  updateMessage: (message: string) => void;
  message: string;
};

export default function ChatMessageInputField({
  updateMessage,
  message,
}: Props) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateMessage(event.target.value);
  }

  return (
    <div className="flex-grow">
      <input
        type="text"
        name="message"
        placeholder="Type a message..."
        max={100}
        onChange={handleChange}
        value={message}
        className="bg-transparent text-white min-h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full"
      />
    </div>
  );
}
