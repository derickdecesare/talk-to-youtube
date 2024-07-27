import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/css/tailwind.css";

function Options() {
  return (
    <div className="text-center p-5">
      <h1 className="text-2xl font-bold">Options Page</h1>
      <p>This is the options page for our Chrome extension.</p>
    </div>
  );
}

function init() {
  const appContainer = document.createElement("div");
  document.body.appendChild(appContainer);

  if (!appContainer) {
    throw new Error("Cannot find appContainer");
  }

  const root = createRoot(appContainer);
  root.render(<Options />);
}

init();
