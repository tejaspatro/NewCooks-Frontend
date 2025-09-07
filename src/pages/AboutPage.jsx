import React from "react";
import { FaUsers, FaBullseye, FaHandshake, FaUtensils } from "react-icons/fa";

export default function AboutPage({ darkMode }) {
  // Wrapper Card Component
  const DiagonalCard = ({ children, index, darkMode }) => (
    <div
      className={`card card-glow card-glow-float shadow-lg p-4 mt-4 rounded-3 ${
        darkMode ? "bg-dark-glow card-grid-overlay" : "bg-light-red card-grid-overlay"
      }`}
    >
      {/* Auto diagonal glow */}
      {index % 2 === 0 ? (
        <>
          <span className="glow-float glow-float-br"></span>
          <span className="glow-corner glow-tl"></span>
        </>
      ) : (
        <>
          <span className="glow-float glow-float-bl"></span>
          <span className="glow-corner glow-tr"></span>
        </>
      )}
      {children}
    </div>
  );

  return (
    <div className={`bg-main bg-dots page-content${darkMode ? " dark-mode" : ""}`}>
      {/* Heading */}
      <h1
        style={{
          textShadow: darkMode
            ? "0 2px 12px #b38f00, 0 1px 0 #000"
            : "0 2px 12px #ffb7b7, 0 1px 0 #fff",
        }}
        className={`text-center fw-bold mb-5 display-5 ${
          darkMode ? "text-deep-yellow" : "text-danger"
        }`}
      >
        About Us
      </h1>

      {/* Who We Are */}
      <DiagonalCard index={0} darkMode={darkMode}>
        <h2 className="fw-bold mb-4 fs-3 text-primary">
          <FaUsers className="me-2" />
          Who We Are
        </h2>
        <p>
          NewCooks is a platform designed to connect passionate chefs with curious food lovers.
          Whether you are a home cook experimenting with recipes or a professional chef
          showcasing your expertise, we provide the space to share, learn, and grow together.
        </p>
      </DiagonalCard>

      {/* Our Mission */}
      <DiagonalCard index={1} darkMode={darkMode}>
        <h2 className="fw-bold mb-4 fs-3 text-primary">
          <FaBullseye className="me-2" />
          Our Mission
        </h2>
        <p>
          We aim to make cooking interactive, accessible, and fun. Our mission is to empower
          chefs to share their creativity and help users discover delicious recipes with ease.
        </p>
      </DiagonalCard>

      {/* What We Offer */}
      <DiagonalCard index={2} darkMode={darkMode}>
        <h2 className="fw-bold mb-4 fs-3 text-primary">
          <FaUtensils className="me-2" />
          What We Offer
        </h2>
        <ul className="list-unstyled ms-3">
          <li className="mb-2">📖 Wide range of recipes curated by chefs and users</li>
          <li className="mb-2">⭐ Ratings & reviews to help you choose the best dishes</li>
          <li className="mb-2">👨‍🍳 Tools for chefs to create, edit, and manage recipes</li>
          <li>💬 Interactive community for food discussions and tips</li>
        </ul>
      </DiagonalCard>

      {/* Our Values */}
      <DiagonalCard index={3} darkMode={darkMode}>
        <h2 className="fw-bold mb-4 fs-3 text-primary">
          <FaHandshake className="me-2" />
          Our Values
        </h2>
        <p>
          At NewCooks, we believe in collaboration, authenticity, and creativity. We strive to
          build a community where everyone — from amateur cooks to seasoned chefs — can feel
          inspired and valued.
        </p>
      </DiagonalCard>
    </div>
  );
}
