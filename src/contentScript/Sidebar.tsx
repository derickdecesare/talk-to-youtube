import React, { useState, useRef, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
}

function Sidebar({ isOpen }: SidebarProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, message]);
      setMessage("");
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
        className="absolute top-2 left-[-10px] w-5 h-10 bg-zinc-600 cursor-ew-resize rounded-l-lg flex items-center justify-center"
      >
        ⋮
      </div>
      <h2 className="p-4 border-b border-zinc-700 font-bold text-lg">
        YouTube Chat
      </h2>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="mb-2 text-sm leading-relaxed p-2 bg-zinc-700 rounded-lg max-w-[80%] self-end break-words"
          >
            {msg}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-zinc-700 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-grow p-2 bg-zinc-700 text-zinc-200 border-none rounded-l-md transition-all duration-150 ease-in-out outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-30 mr-0"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-zinc-700 text-teal-300 border-none p-2 rounded-r-md cursor-pointer transition-colors duration-150 ease-in-out hover:bg-zinc-600 active:bg-zinc-800"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
