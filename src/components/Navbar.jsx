import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  // State for auth info
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [chefId, setChefId] = useState(localStorage.getItem("chefId"));

  // Sync when localStorage changes
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
    setChefId(localStorage.getItem("chefId"));
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear auth
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("chefId");
        localStorage.removeItem("jwtToken");

        // Update state so navbar re-renders
        setToken(null);
        setRole(null);
        setChefId(null);

        // Optional: redirect
        navigate("/login", { replace: true });
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#d62828" }}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">NewCooks</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {role === "chef" && chefId && (
              <li className="nav-item">
                <Link to={`/chef/${chefId}/recipes`} className="nav-link">My Recipes</Link>
              </li>
            )}

            {role === "user" && (
              <li className="nav-item">
                <Link to="/recipes" className="nav-link">Recipes</Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <i
              id="theme-toggle"
              className={`fas ${darkMode ? "fa-sun" : "fa-moon"} me-3 text-white`}
              style={{ cursor: "pointer", fontSize: "1.5rem" }}
              title={darkMode ? "Enable Light Mode" : "Enable Dark Mode"}
              onClick={() => {
                setDarkMode(!darkMode);
                localStorage.setItem("darkMode", !darkMode);
              }}
            ></i>

            {!token ? (
              <>
                <Link to="/login" className="btn btn-light me-2">Login</Link>
                <Link to="/signup" className="btn btn-warning">Sign Up</Link>
              </>
            ) : (
              <button className="btn btn-warning" onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
