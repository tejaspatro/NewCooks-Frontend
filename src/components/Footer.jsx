import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  // Get role directly from localStorage
  const role = localStorage.getItem("role"); // "user", "chef", or null

  return (
    <footer className="text-light pt-5 pb-3 " style={{borderTop:"2px solid yellow", backgroundColor: "#8b0000", zIndex: 1, position: "relative",}}>
      <div className="container">
        <div className="row">
          {/* About */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-primary">About NewCooks</h5>
            <p>
              Discover, cook, and share recipes with ease. NewCooks connects chefs and food lovers,
              making cooking more interactive and fun.
            </p>
          </div>

          {/* Quick Links (Role Based) */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-primary">Quick Links</h5>
            <ul className="list-unstyled">
              {role === "chef" && <li><Link to="/chef/homepage" className="text-decoration-none text-link-hover">Home</Link></li>}
              {role === "user" && <li><Link to="/user/homepage" className="text-decoration-none text-link-hover">Home</Link></li>}
              <li><Link to="/about" className="text-decoration-none text-link-hover">About</Link></li>
              {role === "user" && (
                <>
                  <li><Link to="/recipes" className="text-decoration-none text-link-hover">Browse Recipes</Link></li>
                </>
              )}
              {role === "chef" && (
                <>
                  <li><Link to="/chef/recipes" className="text-decoration-none text-link-hover">My Recipes</Link></li>
                  <li><Link to="/chef/recipes/add" className="text-decoration-none text-link-hover">Add Recipe</Link></li>
                  <li><Link to="/chef/chefprofile" className="text-decoration-none text-link-hover">Profile</Link></li>
                </>
              )}
              <li><Link to="/help" className="text-decoration-none text-link-hover">Help & Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-primary">Contact Us</h5>
            <ul className="list-unstyled">
              <li><FaEnvelope className="me-2" /> ptrotejas@gmail.com</li>
              <li><FaPhone className="me-2" /> +91 80185 37027</li>
              <li><FaMapMarkerAlt className="me-2" /> ITER, Bhubaneswar, Odisha, India</li>
            </ul>
            <div className="d-flex gap-3 mt-3">
              <a href="https://facebook.com" className="text-link-hover fs-5"><FaFacebook /></a>
              <a href="https://instagram.com" className="text-link-hover fs-5"><FaInstagram /></a>
              <a href="https://twitter.com" className="text-link-hover fs-5"><FaTwitter /></a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <hr className="border-light" />
        <div className="text-center">
          <small>© {new Date().getFullYear()} NewCooks. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
