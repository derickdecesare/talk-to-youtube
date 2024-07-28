import React from "react";

interface MessageProps {
  content: string;
  role: "user" | "assistant";
}

const Message: React.FC<MessageProps> = ({ content, role }) => {
  return (
    <div
      className={`mb-4 w-full rounded-lg p-3 ${
        role === "user" ? "bg-zinc-900/80" : "bg-zinc-700"
      }`}
    >
      <div className="break-words max-w-full">{content}</div>
    </div>
  );
};

export default Message;
