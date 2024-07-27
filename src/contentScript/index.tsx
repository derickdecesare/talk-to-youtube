import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/css/tailwind.css";
import ContentScriptApp from "./ContentScriptApp";

function init() {
  const appContainer = document.createElement("div");
  appContainer.id = "my-extension-root";
  document.body.appendChild(appContainer);

  if (!appContainer) {
    throw new Error("Can't find AppContainer");
  }

  const root = createRoot(appContainer);
  root.render(<ContentScriptApp />);
}

init();
