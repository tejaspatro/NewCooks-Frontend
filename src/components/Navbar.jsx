import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");         // Get role info
  const chefId = localStorage.getItem("chefId");     // Chef ID for My Recipes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("chefId"); // Cleanup if set
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#d62828" }}>
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          NewCooks
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* Show "My Recipes" only if logged-in as chef */}
            {role === "chef" && chefId && (
              <li className="nav-item">
                <Link to={`/chef/${chefId}/recipes`} className="nav-link">My Recipes</Link>
              </li>
            )}

            {/* Optional: show "Recipes" for user */}
            {role === "user" && (
              <li className="nav-item">
                <Link to="/recipes" className="nav-link">Recipes</Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Right side controls */}
          <div className="d-flex align-items-center">
            {/* Dark Mode Toggle Icon */}
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

            {/* Auth Buttons */}
            {!token ? (
              <>
                <Link to="/login" className="btn btn-light me-2">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-warning">
                  Sign Up
                </Link>
              </>
            ) : (
              <button className="btn btn-warning" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
