import React, { useEffect, useState } from "react";
import axiosApi from '../api/axiosConfig'; // Import the new Axios instance
import { useNavigate, Link } from "react-router-dom";
import bg1 from '../images/login-bg1.jpg';
import bg2 from '../images/login-bg2.jpg';
import bg3 from '../images/login-bg3.jpg';
import Swal from "sweetalert2";
import BackgroundLayout from "../Layouts/BackgroundLayouts";

export default function LoginPage({ darkMode }) {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [mounted, setMounted] = useState(false); //for first image animation
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      const endpoint = role === "chef" ? "/auth/chef/login" : "/auth/user/login";
      const res = await axiosApi.post(endpoint, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      if (role === "chef") localStorage.setItem("chefId", res.data.user.id);
      else localStorage.setItem("userId", res.data.user.id);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${res.data.user.name || "Chef/User"}!`,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      Swal.fire("Login Error", msg, "error");
    } finally {
      setLoading(false); // stop loading in both success/error
    }
  };

  return (
    <>

      {/* Centered login box */}
      <BackgroundLayout darkMode={darkMode}>
        <h2 className="text-center mb-1">Login</h2>
        <div className="text-center">
          <p>Enter your email and password to login</p>
          <hr className="my-2" />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3 text-center">
            <div className="form-check form-check-inline">
              <input type="radio" id="user" className="form-check-input" value="user" checked={role === "user"} onChange={(e) => setRole(e.target.value)} />
              <label className="form-check-label" htmlFor="user">
                User
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input type="radio" id="chef" className="form-check-input" value="chef" checked={role === "chef"} onChange={(e) => setRole(e.target.value)} />
              <label className="form-check-label" htmlFor="chef">
                Chef
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input required type="email" className="form-control pe-5" placeholder="mail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
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

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-3 text-center">
          Don’t have an account? <Link to="/signup">Click here</Link>
        </p>
      </BackgroundLayout>
    </>
  );
}
