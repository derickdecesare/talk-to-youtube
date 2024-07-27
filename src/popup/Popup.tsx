import React, { useState, useEffect } from "react";

function Popup() {
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [anthropicKey, setAnthropicKey] = useState<string>("");

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = () => {
    chrome.storage.local.get(["openAIKey", "anthropicKey"], (result) => {
      console.log("API keys loaded", result);
      setOpenAIKey(result.openAIKey || "");
      setAnthropicKey(result.anthropicKey || "");
    });
  };

  const handleSave = () => {
    chrome.storage.local.set({ openAIKey, anthropicKey }, () => {
      console.log("API keys saved, message sent, and saved to storage");

      // Notify content script that keys have been updated
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id!, { action: "apiKeysUpdated" });
      });
    });
  };

  return (
    <div className="w-80 bg-zinc-900 text-zinc-100 p-4">
      <h1 className="text-xl mb-4 font-medium text-teal-500">
        YouTube Chat Extension
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="openai-key">
          OpenAI API Key
        </label>
        <input
          id="openai-key"
          type="password"
          value={openAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter OpenAI API Key"
        />
      </div>

      <div className="mb-6">
        <label
          className="block text-sm font-medium mb-2"
          htmlFor="anthropic-key"
        >
          Anthropic API Key
        </label>
        <input
          id="anthropic-key"
          type="password"
          value={anthropicKey}
          onChange={(e) => setAnthropicKey(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter Anthropic API Key"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          Save Keys
        </button>
      </div>
    </div>
  );
}

export default Popup;
