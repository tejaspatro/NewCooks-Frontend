import { Link, useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import ChefSearchBar from "./ChefSearchBar";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  // State for auth info
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [chefId, setChefId] = useState(localStorage.getItem("chefId"));

  // Sync when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
      setChefId(localStorage.getItem("chefId"));
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
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
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#d62828" }}>
          <div className="container-fluid">
            <NavLink
                    to={role === "chef" ? "/chef/homepage" : "/user/homepage"}
                    className={({ isActive }) =>
                      `navbar-brand fw-bold nav-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    NewCooks
                  </NavLink>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink
                    to={role === "chef" ? "/chef/homepage" : "/user/homepage"}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    Home
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to={role === "chef" ? "/chef/recipes" : "/recipes"}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    {role === "chef" ? "My Recipes" : "Recipes"}
                  </NavLink>
                </li>

                {role && <li className="nav-item">
                  <NavLink
                    to={role === "chef" ? "/chef/chefprofile" : "user/userprofile"}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    My Profile
                  </NavLink>
                </li>}

                <li className="nav-item">
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    About
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    Contact Us
                  </NavLink>
                </li>
              </ul>

              <div className="d-flex align-items-center ms-right">
                <i
                  id="theme-toggle"
                  className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"} me-2`}
                  style={{
                    cursor: "pointer",
                    fontSize: "1.6rem",
                    color: darkMode ? "#FFD43B" : "#00bcddff", // yellow for sun, blue for moon
                    transition: "color 0.3s ease, transform 0.3s ease"
                  }}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  onClick={() => {
                    setDarkMode(!darkMode);
                    localStorage.setItem("darkMode", !darkMode);
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(20deg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
                />

                <div className="me-3">
                  {role === "chef" && chefId && <ChefSearchBar />}
                  {/* {role === "user" && <UserSearchBar />} */}
                </div>

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
      </header>
    </>
  );
}
