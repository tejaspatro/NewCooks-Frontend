import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUtensils, FaUser } from "react-icons/fa";

export default function HelpPage({ darkMode }) {

    // Wrapper Card Component
    const DiagonalCard = ({ children, index, darkMode }) => (
        <div
            className={`card card-glow card-glow-float shadow-lg p-4 mt-4 rounded-3 ${darkMode ? "bg-dark-glow card-grid-overlay" : "bg-light-red card-grid-overlay"
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
            <h1 style={{
                textShadow: darkMode ? "0 2px 12px #b38f00, 0 1px 0 #000" : "0 2px 12px #ffb7b7, 0 1px 0 #fff"
            }}
                className={`text-center fw-bold mb-5 display-5 ${darkMode ? "text-deep-yellow" : "text-danger"}`}>
                Help & Support
            </h1>

            {/* Beginner's Guide */}
            <DiagonalCard index={0} darkMode={darkMode}>
                <h2 className="fw-bold mb-4 fs-3 text-primary">Beginner’s Guide</h2>

                {/* User Guide */}
                <div id="user-guide" className="mb-4">
                    <h4 className="fw-semibold mb-3"><FaUser className="me-2" /> User Guide</h4>
                    <ul className="list-unstyled ms-3">
                        <li className="mb-3">
                            <h6 className="fw-semibold text-info">🔎 Browsing Recipes</h6>
                            <p className="mb-0">Use the search or categories to find recipes that match your taste.</p>
                        </li>
                        <li className="mb-3">
                            <h6 className="fw-semibold text-info">⭐ Rating & Reviews</h6>
                            <p className="mb-0">Scroll down a recipe page to leave your rating and share feedback.</p>
                        </li>
                        <li>
                            <h6 className="fw-semibold text-info">📒 Saving Recipes</h6>
                            <p className="mb-0">Bookmark your favorite recipes for quick access later.</p>
                        </li>
                    </ul>
                </div>

                {/* Chef Guide */}
                <div id="chef-guide">
                    <h4 className="fw-semibold mb-3"><FaUtensils className="me-2" /> Chef Guide</h4>
                    <ul className="list-unstyled ms-3">
                        <li className="mb-3">
                            <h6 className="fw-semibold text-success">✍️ Adding Recipes</h6>
                            <p className="mb-0">Go to “My Recipes” and click “Add Recipe” to start creating.</p>
                        </li>
                        <li className="mb-3">
                            <h6 className="fw-semibold text-success">🖊️ Editing Recipes</h6>
                            <p className="mb-0">You can update your recipes anytime from your recipe dashboard.</p>
                        </li>
                        <li>
                            <h6 className="fw-semibold text-success">🗑️ Managing Recipes</h6>
                            <p className="mb-0">Remove outdated recipes with one click using the delete option.</p>
                        </li>
                    </ul>
                </div>
            </DiagonalCard>


            {/* FAQs */}
            <DiagonalCard index={1} darkMode={darkMode}>
                <h2 id="faqs" className=" fw-bold mb-4 fs-3 text-primary">Frequently Asked Questions</h2>
                <div className="faq-list">
                    <div className="mb-4">
                        <h6 className="fw-semibold">How do I create a recipe?</h6>
                        <p className="mb-0">
                            If you are a chef, log in to your account, go to "My Recipes" and click "Add Recipe".
                        </p>
                    </div>
                    <div className="mb-4">
                        <h6 className="fw-semibold">How can I review a recipe?</h6>
                        <p className="mb-0">
                            If you are a user, open a recipe and scroll down to the reviews section to leave your feedback.
                        </p>
                    </div>
                    <div className="mb-4">
                        <h6 className="fw-semibold">Do I need to log in to view recipes?</h6>
                        <p className="mb-0">
                            Guests can browse recipes, but to add, review, or save recipes you must log in.
                        </p>
                    </div>
                </div>
            </DiagonalCard>

            {/* Contact Us */}
            <DiagonalCard index={2} darkMode={darkMode}>
                <div id="contact-us">
                    <h2 className="fw-bold mb-4 fs-3 text-primary">Contact Us</h2>
                    <p>If you still need help, reach out to us:</p>
                    <ul className="list-unstyled">
                        <li className="mb-2">
                            <FaEnvelope className="me-2" />
                            <a href="mailto:support@newcooks.com" style={{  color: "" }}>
                                support@newcooks.com
                            </a>
                        </li>
                        <li className="mb-2">
                            <FaPhone className="me-2" />+91 80185 37027
                        </li>
                        <li>
                            <FaMapMarkerAlt className="me-2" />ITER, Bhubaneswar, Odisha, India
                        </li>
                    </ul>
                </div>
            </DiagonalCard>
        </div>
    );
}
