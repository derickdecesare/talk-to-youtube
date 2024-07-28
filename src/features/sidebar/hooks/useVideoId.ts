import { useState, useEffect } from "react";

function getCurrentVideoId(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

export function useVideoId() {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(
    getCurrentVideoId()
  );

  useEffect(() => {
    const checkForVideoChange = () => {
      const videoId = getCurrentVideoId();
      if (videoId !== currentVideoId) {
        console.log("Video ID changed", videoId);
        setCurrentVideoId(videoId);
      }
    };

    // Initial check
    checkForVideoChange();

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", checkForVideoChange);

    // Create a custom event listener for YouTube navigation
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.target.nodeName === "TITLE")) {
        checkForVideoChange();
      }
    });

    observer.observe(document.querySelector("head"), {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => {
      window.removeEventListener("popstate", checkForVideoChange);
      observer.disconnect();
    };
  }, [currentVideoId]);

  return currentVideoId;
}
