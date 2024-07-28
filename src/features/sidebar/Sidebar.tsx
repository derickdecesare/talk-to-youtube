import React, { useState, useRef, useEffect } from "react";
import { useVideoId } from "./hooks/useVideoId";
import { useSidebarResize } from "./hooks/useSidebarResize";
import { useModelWrapper } from "./hooks/useModelWrapper";
import { useChat } from "./hooks/useChat";
import {
  SidebarProps,
  ChatHookReturn,
  SidebarResizeReturn,
} from "@/interfaces";
import ResizeHandle from "./components/ResizeHandle";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

function Sidebar({ isOpen, apiKeys }: SidebarProps) {
  const currentVideoId: string | null = useVideoId();
  const modelWrapper = useModelWrapper(apiKeys, currentVideoId);
  const {
    messages,
    inputMessage,
    setInputMessage,
    isStreaming,
    sendMessage,
  }: ChatHookReturn = useChat(modelWrapper, currentVideoId);
  const { sidebarWidth, sidebarRef, resizeRef }: SidebarResizeReturn =
    useSidebarResize(300);
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
      <ResizeHandle ref={resizeRef} />
      <Header title="YouTube Chat" />
      <MessageList messages={messages} />
      <ChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSend={sendMessage}
        isStreaming={isStreaming}
        isOpen={isOpen}
      />
    </div>
  );
}

export default Sidebar;
