import React, { useState, useRef, useEffect } from "react";
import ModelWrapper from "../../utils/ai/ModelWrapper";

interface SidebarProps {
  isOpen: boolean;
  apiKeys: {
    openAIKey: string;
    anthropicKey: string;
  };
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Sidebar({ isOpen, apiKeys }: SidebarProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isStreaming, setIsStreaming] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modelWrapper = useRef<ModelWrapper | null>(null);

  useEffect(() => {
    modelWrapper.current = new ModelWrapper(
      apiKeys.openAIKey,
      apiKeys.anthropicKey
    );
    console.log("ModelWrapper initialized");
    console.log("modelwrapper.current", modelWrapper.current);
  }, [apiKeys]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && modelWrapper.current) {
      const userMessage: Message = { role: "user", content: inputMessage };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsStreaming(true);

      // this is why we see the bubble before it starts streaming
      const assistantMessage: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        // we pass just the text content from the messages
        const stream = modelWrapper.current.chat(
          messages.map((msg) => msg.content).concat(inputMessage),
          "openai" // or "anthropic", depending on your preference
        );

        // we add each chunk to the last assistant message content
        for await (const chunk of stream) {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: lastMessage.content + chunk },
              ];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Error in AI response:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setIsStreaming(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const newWidth = Math.max(
          300,
          Math.min(600, window.innerWidth - e.clientX)
        );
        setSidebarWidth(newWidth);
      }
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };

    const startResize = (e: MouseEvent) => {
      e.preventDefault();
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResize);
    };

    resizeRef.current?.addEventListener(
      "mousedown",
      startResize as EventListener
    );

    return () => {
      resizeRef.current?.removeEventListener(
        "mousedown",
        startResize as EventListener
      );
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 h-full bg-zinc-800 text-zinc-200 shadow-lg transition-transform duration-300 ease-in-out z-[10000] rounded-l-lg flex flex-col`}
      style={{
        width: `${sidebarWidth}px`,
        transform: isOpen
          ? "translateX(0)"
          : `translateX(${sidebarWidth + 20}px)`,
      }}
    >
      <div
        ref={resizeRef}
        className="absolute top-2 left-[-10px] w-5 h-10 bg-zinc-600 cursor-ew-resize rounded-l-lg flex items-center justify-center "
      >
        ⋮
      </div>
      <h2 className="p-4 border-b border-zinc-700 font-bold text-2xl">
        YouTube Chat
      </h2>
      <div className="flex-grow overflow-y-auto p-4 px-6 text-xl">
        {messages.map((msg, index) =>
          msg.content ? (
            <div
              key={index}
              className={`mb-4 w-full rounded-lg p-3 ${
                msg.role === "user" ? "bg-zinc-900/80" : "bg-zinc-700"
              }`}
            >
              <div className="break-words max-w-full">{msg.content}</div>
            </div>
          ) : null
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-zinc-700 flex text-xl">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" && !isStreaming && handleSendMessage()
          }
          className="flex-grow p-2 bg-zinc-700 text-zinc-200 border-none rounded-l-md transition-all duration-150 ease-in-out outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-30 mr-0 "
          placeholder="Type a message..."
          disabled={isStreaming}
        />
        <button
          onClick={handleSendMessage}
          className={`bg-zinc-700 text-teal-300 border-none p-2 rounded-r-md cursor-pointer transition-colors duration-150 ease-in-out hover:bg-zinc-600 active:bg-zinc-800 ${
            isStreaming ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isStreaming}
        >
          {isStreaming ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
