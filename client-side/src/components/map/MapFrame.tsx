"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Maximize2, X } from "lucide-react";

interface MapFrameProps {
  /** Height/size of the inline map (the modal map always fills the overlay). */
  className?: string;
  title?: string;
  /** Renders a fresh <MapContainer>; `expanded` is true for the modal instance. */
  children: (expanded: boolean) => ReactNode;
  /** Extra buttons in the overlay toolbar; receives a `close` to dismiss the overlay. */
  renderActions?: (close: () => void) => ReactNode;
}

// Wraps a map with an "Expand" control that opens a fullscreen overlay.
export default function MapFrame({
  className = "h-64 w-full",
  title = "Map",
  children,
  renderActions,
}: MapFrameProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    // Prevent the page behind the overlay from scrolling.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  return (
    <>
      <div className={`relative ${className}`}>
        {children(false)}
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Expand map"
          className="absolute right-3 top-3 z-[500] inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-bold text-[#342417] shadow-md ring-1 ring-black/5 transition hover:bg-white cursor-pointer"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Expand
        </button>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[1000] flex flex-col bg-black/70 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-white">{title}</span>
            <div className="flex items-center gap-2">
              {renderActions?.(() => setExpanded(false))}
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close map"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-[#342417] shadow-md transition hover:bg-white cursor-pointer"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden rounded-2xl">
            {children(true)}
          </div>
        </div>
      )}
    </>
  );
}
