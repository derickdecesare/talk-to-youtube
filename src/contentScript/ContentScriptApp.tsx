import React, { useState, useEffect } from "react";
import Sidebar from "../features/sidebar/Sidebar";

interface ApiKeys {
  openAIKey: string;
  anthropicKey: string;
}

function ContentScriptApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openAIKey: "",
    anthropicKey: "",
  });

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

    // Load API keys on initial mount
    loadApiKeys();

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
      } else if (request.action === "apiKeysUpdated") {
        console.log("API keys updated");
        loadApiKeys();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [isSidebarOpen]);

  const loadApiKeys = () => {
    chrome.storage.local.get(["openAIKey", "anthropicKey"], (result) => {
      console.log("API keys loaded", result);
      setApiKeys({
        openAIKey: result.openAIKey || "",
        anthropicKey: result.anthropicKey || "",
      });
    });
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} apiKeys={apiKeys} />
    </>
  );
}

export default ContentScriptApp;
