import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButton({ darkMode }) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        bottom: "2rem",
        right: "2rem",
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
