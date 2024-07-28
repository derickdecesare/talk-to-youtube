import { useState, useEffect, useRef } from "react";

export function useSidebarResize(initialWidth: number = 400) {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const newWidth = Math.max(
          300,
          Math.min(800, window.innerWidth - e.clientX)
        );
        setSidebarWidth(newWidth);
      }
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };

    const startResize = (e: MouseEvent) => {
      e.preventDefault();
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResize);
    };

    resizeRef.current?.addEventListener(
      "mousedown",
      startResize as EventListener
    );

    return () => {
      resizeRef.current?.removeEventListener(
        "mousedown",
        startResize as EventListener
      );
    };
  }, []);

  return { sidebarWidth, sidebarRef, resizeRef };
}
