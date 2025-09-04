import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function HoverCardPortal({
  darkmode,
  children,          // the anchor (e.g., avatar img)
  renderContent,     // function that returns JSX for the tooltip
  offset = 12,       // gap between avatar and tooltip
  maxWidth = 260,    // tooltip width
}) {
  const anchorRef = useRef(null);
  const tooltipRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: "top" });
  const closeTimer = useRef(null);

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const computePosition = () => {
    if (!anchorRef.current) return;

    const a = anchorRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    // If tooltip is mounted, measure its height. Fallback to ~100 if not yet.
    const tooltipH = tooltipRef.current?.offsetHeight || 110;
    const tooltipW = Math.min(maxWidth, 1000); // just to be safe

    // Default: place ABOVE the avatar, arrow pointing DOWN
    let top = a.top + scrollY - tooltipH - offset;
    let placement = "top";

    // If not enough room above, place BELOW the avatar, arrow pointing UP
    if (top < scrollY + 8) {
      top = a.bottom + scrollY + offset;
      placement = "bottom";
    }

    const left = a.left + scrollX + a.width / 2;

    setCoords({ top, left, placement });
  };

  useLayoutEffect(() => {
    if (open) computePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => clearTimer(), []);

  const tooltip =
    open &&
    createPortal(
      <div
        ref={tooltipRef}
        className={`review-tooltip-portal ${coords.placement} ${darkmode ? "review-tooltip-background-dark" : "review-tooltip-background-light"}`}
        style={{
          position: "absolute",
          top: coords.top,
          left: coords.left,
          transform: "translateX(-50%)",
          maxWidth,
          zIndex: 9999,
        }}
        onMouseEnter={() => {
          clearTimer(); // keep open when hovering tooltip
          computePosition();
        }}
        onMouseLeave={scheduleClose}
      >
        {renderContent?.()}
        <span className="review-tooltip-arrow" />
      </div>,
      document.body
    );

  return (
    <>
      <span
        ref={anchorRef}
        onMouseEnter={() => {
          clearTimer();
          setOpen(true);
        }}
        onMouseLeave={scheduleClose}
        onFocus={() => setOpen(true)}
        onBlur={scheduleClose}
        style={{ display: "inline-block" }}
      >
        {children}
      </span>
      {tooltip}
    </>
  );
}
