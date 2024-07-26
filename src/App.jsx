import React, { useState, useEffect } from "react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isContentScriptReady, setIsContentScriptReady] = useState(false);

  useEffect(() => {
    console.log("App component mounted");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "ping" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
            return;
          }
          if (response && response.pong) {
            console.log("Content script is ready");
            setIsContentScriptReady(true);

            // Check sidebar state
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "getSidebarState" },
              (stateResponse) => {
                if (chrome.runtime.lastError) {
                  console.error("Error:", chrome.runtime.lastError.message);
                  return;
                }
                if (stateResponse && stateResponse.isOpen !== undefined) {
                  setIsSidebarOpen(stateResponse.isOpen);
                }
              }
            );
          }
        });
      }
    });
  }, []);

  const toggleSidebar = () => {
    console.log("Toggle sidebar button clicked");
    if (!isContentScriptReady) {
      console.log("Content script is not ready");
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log("Sending toggleSidebar message to tab:", tabs[0].id);
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "toggleSidebar" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error:", chrome.runtime.lastError.message);
              return;
            }
            console.log("Response from content script:", response);
            if (response && response.success) {
              setIsSidebarOpen(response.isOpen);
            }
          }
        );
      }
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Chat Extension</h1>
      <button
        className="bg-zinc-600 text-teal-300 hover:bg-zinc-700 
                   focus:ring-2 focus:ring-teal-400 focus:outline-none
                   active:bg-zinc-800
                   transition-all duration-150 ease-in-out
                   px-4 py-2 rounded"
        onClick={toggleSidebar}
        // disabled={!isContentScriptReady}
      >
        {isContentScriptReady
          ? isSidebarOpen
            ? "Close Sidebar"
            : "Open Sidebar"
          : "Loading..."}
      </button>
    </div>
  );
}

export default App;
