import React, { useEffect, useState } from "react";
import axiosApi from "../api/axiosConfig.jsx"; // Import the new Axios instance
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";


// Note: With the new axios config, your backend endpoints are now relative paths
// from your baseURL. For example: "/auth/chef/register"

// Make sure these file names and paths match exactly what you have in your project's file system.
// If the images are named 'bg1.jpg', 'bg2.jpg', etc., you will need to change these import statements.
import bg1 from "../images/login-bg1.jpg";
import bg2 from "../images/login-bg2.jpg";
import bg3 from "../images/login-bg3.jpg";
import BackgroundLayout from "../Layouts/BackgroundLayouts.jsx";

export default function SignupPage({ darkMode }) {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false); // New state for the checkbox
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // disable button immediately

    if (!agreed) {
      setLoading(false);
      return Swal.fire("Terms Error", "You must agree to the Terms and Conditions.", "error");
    }

    try {
      const endpoint = role === "chef" ? "/auth/chef/register" : "/auth/user/register";
      await axiosApi.post(endpoint, { name, email, password });

      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "Check your email for the activation link to activate your account.",
        confirmButtonText: "Go to Login"
      }).then(() => navigate("/login"));
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      Swal.fire("Signup Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Signup box */}
      <BackgroundLayout darkMode={darkMode}>
        <h2 className="text-center mb-1">Sign Up</h2>
        <div className="text-center">
          <p>Start your new cooking journey</p>
          <hr className="my-2" />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSignup}>
          {/* Role selection */}
          <div className="mb-3 text-center">
            <div className="form-check form-check-inline">
              <input
                type="radio"
                id="user"
                className="form-check-input"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label" htmlFor="user">
                User
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                id="chef"
                className="form-check-input"
                value="chef"
                checked={role === "chef"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label" htmlFor="chef">
                Chef
              </label>
            </div>
          </div>

          {/* Name */}
          <div className="mb-2">
            <label className="form-label">Name</label>
            <input
              required
              type="text"
              className="form-control"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              required
              type="email"
              className="form-control"
              value={email}
              placeholder="mail@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input
              required
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Eye icon button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn position-absolute top-50 end-0 translate-middle-y"
              style={{
                top: "50%",
                right: "12px",
                transform: "translateY(-50%)",
                paddingRight: "10px",
                paddingTop: "40px",
                border: "none",
                background: "transparent",
                color: "#dc3545", // same as login button
                fontSize: "1.2rem"
              }}
            >
              <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </button>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="agreedCheckbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="agreedCheckbox">
              I agree to the{" "}
              <a href="#">Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" className="btn btn-danger w-100" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>

        </form>

        <p className="mt-1 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </BackgroundLayout>
    </>
  );
}
