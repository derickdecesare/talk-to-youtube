import React, { useState, useEffect, useRef } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const sidebarRef = useRef(null);

  useEffect(() => {
    console.log("Sidebar component mounted");
    return () => console.log("Sidebar component unmounted");
  }, []);

  useEffect(() => {
    console.log("Sidebar isOpen state changed:", isOpen);
  }, [isOpen]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "k" || event.key === "K")
      ) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prev) => [...prev, inputValue]);
      setInputValue("");
    }
  };

  return (
    <div
      ref={sidebarRef}
      style={{
        position: "fixed",
        top: 0,
        right: isOpen ? 0 : "-340px",
        width: "340px",
        height: "100%",
        backgroundColor: "#27272a",
        color: "#e4e4e7",
        transition: "right 0.3s ease-in-out",
        zIndex: 9999,
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "16px", borderBottom: "1px solid #3f3f46" }}>
        <h2>YouTube Chat</h2>
      </div>
      <div style={{ flexGrow: 1, overflowY: "auto", padding: "16px" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              fontSize: "12px",
              lineHeight: 1.4,
              padding: "8px 12px",
              backgroundColor: "#3f3f46",
              borderRadius: "8px",
              marginBottom: "8px",
              wordWrap: "break-word",
              maxWidth: "80%",
              alignSelf: "flex-end",
            }}
          >
            {msg}
          </div>
        ))}
      </div>
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #3f3f46",
          display: "flex",
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          style={{
            flexGrow: 1,
            padding: "8px",
            backgroundColor: "#3f3f46",
            color: "#e4e4e7",
            border: "none",
            borderRadius: "4px",
            marginRight: "8px",
          }}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          style={{
            backgroundColor: "#3f3f46",
            color: "#5eead4",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
export const test = "This is a test export";
