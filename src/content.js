// Sidebar state and styles
let sidebarOpen = false;
const SIDEBAR_MIN_WIDTH = 300;
const SIDEBAR_MAX_WIDTH = 600;
let sidebarWidth = SIDEBAR_MIN_WIDTH;

const sidebarStyles = `
  position: fixed;
  top: 0;
  right: -${SIDEBAR_MIN_WIDTH + 20}px;
  width: ${SIDEBAR_MIN_WIDTH}px;
  height: 100%;
  background-color: #27272a; /* Dark zinc color */
  color: #e4e4e7; /* Light zinc color for text */
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  transition: right 0.3s ease-in-out;
  z-index: 9999;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  display: flex;
  flex-direction: column;
`;

const resizeHandleStyles = `
  position: absolute;
  top: 8px;
  left: -15px;
  width: 20px;
  height: 40px;
  background-color: #4b5563;
  cursor: ew-resize;
  border-radius: 10px 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const buttonStyles = `
  background-color: #3f3f46;
  color: #5eead4;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
`;

const inputStyles = `
  flex-grow: 1;
  padding: 8px;
  background-color: #3f3f46;
  color: #e4e4e7;
  border: none;
  border-radius: 4px;
  transition: all 0.15s ease-in-out;
  outline: none;
  margin-right: 8px;
`;

function createSidebar() {
  const sidebar = document.createElement("div");
  sidebar.id = "youtube-chat-extension-sidebar";
  sidebar.style.cssText = sidebarStyles;

  const resizeHandle = document.createElement("div");
  resizeHandle.style.cssText = resizeHandleStyles;
  resizeHandle.innerHTML = "⋮"; // Simple drag handle icon
  resizeHandle.addEventListener("mousedown", initResize);

  sidebar.appendChild(resizeHandle);
  document.body.appendChild(sidebar);
  return sidebar;
}

function createSidebarContent() {
  const content = document.createElement("div");
  content.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
  `;
  content.innerHTML = `
    <h2 style="padding: 16px; margin: 0; border-bottom: 1px solid #3f3f46;">YouTube Chat</h2>
    <div id="chat-messages" style="flex-grow: 1; overflow-y: auto; padding: 16px;"></div>
    <div style="padding: 16px; border-top: 1px solid #3f3f46; display: flex;">
      <input type="text" id="chat-input" placeholder="Type a message..." style="${inputStyles}">
      <button id="send-message" style="${buttonStyles}">Send</button>
    </div>
  `;
  return content;
}

function toggleSidebar() {
  let sidebar = document.getElementById("youtube-chat-extension-sidebar");
  if (!sidebar) {
    sidebar = createSidebar();
    sidebar.appendChild(createSidebarContent());
    setupChatFunctionality(sidebar);
  }
  sidebarOpen = !sidebarOpen;
  sidebar.style.right = sidebarOpen ? "0px" : `-${sidebarWidth + 20}px`;
}

function setupChatFunctionality(sidebar) {
  const input = sidebar.querySelector("#chat-input");
  const sendButton = sidebar.querySelector("#send-message");
  const messagesContainer = sidebar.querySelector("#chat-messages");

  sendButton.addEventListener("click", () =>
    sendMessage(input, messagesContainer)
  );
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage(input, messagesContainer);
  });

  // Add hover and focus effects to the input
  input.addEventListener("focus", () => {
    input.style.boxShadow = "0 0 0 2px rgba(94, 234, 212, 0.3)";
  });
  input.addEventListener("blur", () => {
    input.style.boxShadow = "none";
  });

  // Add hover and active effects to the button
  sendButton.addEventListener("mouseover", () => {
    sendButton.style.backgroundColor = "#52525b";
  });
  sendButton.addEventListener("mouseout", () => {
    sendButton.style.backgroundColor = "#3f3f46";
  });
  sendButton.addEventListener("mousedown", () => {
    sendButton.style.backgroundColor = "#27272a";
  });
  sendButton.addEventListener("mouseup", () => {
    sendButton.style.backgroundColor = "#52525b";
  });
}

function sendMessage(input, messagesContainer) {
  const message = input.value.trim();
  if (message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.style.cssText = `
      font-size: 12px;
      line-height: 1.4;
      padding: 8px 12px;
      background-color: #3f3f46;
      border-radius: 8px;
      margin-bottom: 8px;
      word-wrap: break-word;
      max-width: 80%;
      align-self: flex-end;
    `;
    messagesContainer.appendChild(messageElement);
    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function initResize(e) {
  e.preventDefault();
  window.addEventListener("mousemove", resize);
  window.addEventListener("mouseup", stopResize);
}

function resize(e) {
  const sidebar = document.getElementById("youtube-chat-extension-sidebar");
  sidebarWidth = Math.max(
    SIDEBAR_MIN_WIDTH,
    Math.min(SIDEBAR_MAX_WIDTH, window.innerWidth - e.clientX)
  );
  sidebar.style.width = `${sidebarWidth}px`;
  sidebar.style.right = sidebarOpen ? "0px" : `-${sidebarWidth + 20}px`;
}

function stopResize() {
  window.removeEventListener("mousemove", resize);
}

function getSidebarState() {
  const sidebar = document.getElementById("youtube-chat-extension-sidebar");
  return sidebar && sidebar.style.right === "0px";
}

function setupKeyboardShortcut() {
  document.addEventListener("keydown", function (event) {
    // check if command + k is pressed
    // or on windows check if ctrl + k is pressed
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "k" || event.key === "K")
    ) {
      event.preventDefault(); // Prevent any default behavior
      toggleSidebar();
    }
  });
}

// Modify the existing chrome.runtime.onMessage listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "ping") {
    console.log("Ping received, sending pong");
    sendResponse({ pong: true });
  } else if (request.action === "toggleSidebar") {
    toggleSidebar();
    sendResponse({ success: true, isOpen: sidebarOpen });
  } else if (request.action === "getSidebarState") {
    sendResponse({ isOpen: getSidebarState() });
  }
  return true; // Indicates that the response is sent asynchronously
});

// Call setupKeyboardShortcut when the script loads
setupKeyboardShortcut();

console.log("YouTube Chat Extension content script loaded");
