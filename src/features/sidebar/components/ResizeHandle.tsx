import React from "react";

interface ResizeHandleProps {
  className?: string;
}

const ResizeHandle = React.forwardRef<HTMLDivElement, ResizeHandleProps>(
  ({ className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute top-2 left-[-10px] w-5 h-10 bg-zinc-600 cursor-ew-resize rounded-l-lg flex items-center justify-center ${className}`}
      >
        ⋮
      </div>
    );
  }
);

ResizeHandle.displayName = "ResizeHandle";

export default ResizeHandle;
