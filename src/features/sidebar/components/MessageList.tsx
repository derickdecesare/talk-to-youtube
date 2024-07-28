import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { Message as MessageType } from "@/interfaces";

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4 px-6 text-xl">
      {messages.map((msg, index) =>
        msg.content ? (
          <Message key={index} content={msg.content} role={msg.role} />
        ) : null
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
