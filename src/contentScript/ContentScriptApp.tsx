import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

function ContentScriptApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (request: any, sender: any, sendResponse: any) => {
      if (request.action === "toggleSidebar") {
        setIsSidebarOpen((prev) => !prev);
        sendResponse({ success: true, isOpen: !isSidebarOpen });
      } else if (request.action === "getSidebarState") {
        sendResponse({ isOpen: isSidebarOpen });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} />
    </>
  );
}

export default ContentScriptApp;
