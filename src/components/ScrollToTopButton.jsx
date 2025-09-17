import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButton({ darkMode }) {
  const [showScroll, setShowScroll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 30);
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showScroll) return null;

  return (
    <button
      onClick={scrollToTop}
      className="position-fixed rounded-circle d-flex align-items-center justify-content-center"
      style={{
        bottom: "4.5rem",
        right: isMobile ? "1rem" : "3rem",  // Dynamically adjust
        width: "50px",
        height: "50px",
        backgroundColor: darkMode ? "#ff0015ff" : "#ff7300",
        color: "#fff",
        border: "none",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        cursor: "pointer",
      }}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  );
}
