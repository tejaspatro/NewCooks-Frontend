import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg1 from "../images/login-bg1.jpg";
import bg2 from "../images/login-bg2.jpg";
import bg3 from "../images/login-bg3.jpg";

export default function BackgroundLayout({ darkMode, children }) {
    const images = [bg1, bg2, bg3];
    const [currentImage, setCurrentImage] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Preload images
    useEffect(() => {
        let isMounted = true;
        const loaders = images.map(
            (src) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => resolve({ src, ok: true });
                    img.onerror = () => resolve({ src, ok: false });
                })
        );
        Promise.all(loaders).then((results) => {
            if (!isMounted) return;
            setLoaded(true);
        });
        return () => {
            isMounted = false;
        };
    }, []);

    // Slideshow rotation
    useEffect(() => {
        if (!loaded) return;
        const id = setInterval(() => setCurrentImage((p) => (p + 1) % images.length), 5000);
        return () => clearInterval(id);
    }, [loaded]);

    // Initial zoom trigger
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            {/* Background slides */}
            {images.map((img, idx) => {
                const active = idx === currentImage;
                return (
                    <div
                        aria-hidden="true"
                        key={img + idx}
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundImage: `url(${img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                            zIndex: 0,
                            opacity: active ? 1 : 0,
                            transform: active && mounted ? "scale(1.08)" : "scale(1)",
                            transition: "opacity 900ms ease-in-out, transform 12s linear",
                            pointerEvents: "none",
                        }}
                    />
                );
            })}

            {/* Blur overlay */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 1,
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(6px)",
                    backgroundColor: darkMode ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.35)",
                    pointerEvents: "none",
                }}
            />

            {/* Home button */}
            <Link to="/" style={{ position: "fixed", top: 16, left: 16, zIndex: 4 }}>
                <button
                    className={`btn ${darkMode ? "btn-dark text-light" : "btn-light"}`}
                    style={{
                        pointerEvents: "auto",
                        backgroundColor: darkMode ? "rgba(56, 1, 1, 0.86)" : "",
                        borderColor: darkMode ? "rgba(56, 1, 1, 0.86)" : ""
                    }}
                >
                    🏠 Home
                </button>
            </Link>

            {/* Page content (center box) */}
            <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh", position: "relative", zIndex: 2, padding: "1rem" }}
            >
                <div className="card p-4 shadow-lg"
                    style={{ width: "100%", maxWidth: "420px", backgroundColor: darkMode ? "rgba(56, 1, 1, 0.86)" : "rgba(255,255,255,0.93)", color: darkMode ? "#fff" : "#111" }}
                >
                    {children}
                </div>
            </div>
        </>
    );
}
