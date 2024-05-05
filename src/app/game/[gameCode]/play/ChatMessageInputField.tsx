export default function ChatMessageInputField() {
  return (
    <div className="flex-grow">
      <input
        type="text"
        placeholder="Type a message..."
        className="bg-transparent text-white min-h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full"
      />
    </div>
  );
}
