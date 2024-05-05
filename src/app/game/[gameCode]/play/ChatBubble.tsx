import React from "react";

type Props = {
  message: string;
  sender: string;
};

export default function ChatBubble({ message, sender }: Props) {
  const isCurrentUser = sender === "me"; // Assuming "me" indicates the current user

  return (
    <div
      className={`flex items-start gap-2.5 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex flex-col gap-1 w-full max-w-[320px]">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-white">{sender}</span>
        </div>
        <div
          className={`flex flex-col leading-1.5 p-4 border-gray-950 bg-gray-800 rounded-e-xl rounded-es-xl ${
            isCurrentUser ? "bg-cyan-500" : "bg-gray-800"
          }`}
        >
          <p className="text-sm font-normal text-white"> {message}</p>
        </div>
      </div>
    </div>
  );
}
