import React, { useRef, useEffect } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isStreaming: boolean;
  isOpen: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isStreaming,
  isOpen,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="p-4 border-t border-zinc-700 flex text-xl">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !isStreaming && onSend()}
        className="flex-grow p-2 bg-zinc-700 text-zinc-200 border-none rounded-l-md transition-all duration-150 ease-in-out outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-30 mr-0"
        placeholder="Type a message..."
        disabled={isStreaming}
      />
      <button
        onClick={onSend}
        className={`bg-zinc-700 text-teal-300 border-none p-2 rounded-r-md cursor-pointer transition-colors duration-150 ease-in-out hover:bg-zinc-600 active:bg-zinc-800 ${
          isStreaming ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isStreaming}
      >
        {isStreaming ? "..." : "Send"}
      </button>
    </div>
  );
};

export default ChatInput;
