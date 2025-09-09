import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.css";

// Components & Pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RecipesPage from "./pages/RecipesPage";
import MyRecipesPage from "./pages/chef/MyRecipesPage";
import ChefRecipeDetailPage from "./pages/chef/ChefRecipeDetailPage";
import UserRecipeDetailPage from "./pages/UserRecipeDetailPage";
import AddRecipePage from "./pages/chef/AddRecipePage";
import EditRecipeDetailPage from "./pages/chef/EditRecipePage";
import ChefProfilePage from "./pages/chef/ChefProfilePage";
import ChefHero from "./pages/chef/Homepage/ChefHero";
import UserProfilePage from "./pages/UserProfilePage";
import HelpPage from "./pages/Help";
import AboutPage from "./pages/AboutPage";
import FavoritesPage from "./pages/FavouritesPage";

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  return (
    <Router>
      <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
    </Router>
  );
}

function AppContent({ darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide Navbar on login/signup/forgot pages
  const hideNavbar = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

  // Redirect to homepage based on role on app load
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "chef" && location.pathname === "/") {
      navigate("/chef/homepage", { replace: true });
    } else if (role === "user" && location.pathname === "/") {
      navigate("/", { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <main className={`relative ${darkMode ? "dark-mode" : ""} ${hideNavbar ? "no-padding" : ""}`}>
        {!hideNavbar && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

        <Routes>
          {/* Public pages */}
          <Route path="/login" element={<LoginPage darkMode={darkMode} />} />
          <Route path="/signup" element={<SignupPage darkMode={darkMode} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage darkMode={darkMode} />} />
          <Route path="/help" element={<HelpPage darkMode={darkMode} />} />
          <Route path="/about" element={<AboutPage darkMode={darkMode} />} />

          {/* Chef pages */}
          <Route path="/chef/homepage" element={<ChefHero darkMode={darkMode} />} />
          <Route path="/chef/recipes" element={<ProtectedRoute><MyRecipesPage darkMode={darkMode} /></ProtectedRoute>} />
          <Route path="/chef/recipes/add" element={<AddRecipePage darkMode={darkMode} />} />
          <Route path="/chef/recipes/:recipeId" element={<ChefRecipeDetailPage darkMode={darkMode} />} />
          <Route path="/chef/recipes/:recipeId/edit" element={<EditRecipeDetailPage darkMode={darkMode} />} />
          <Route path="/chef/chefprofile" element={<ChefProfilePage darkMode={darkMode} />} />

          {/* User pages */}
          <Route path="/" element={<HomePage darkMode={darkMode} />} />
          <Route path="/recipes" element={<RecipesPage darkMode={darkMode} />} />
          <Route path="/user/recipes/:recipeId" element={<UserRecipeDetailPage darkMode={darkMode} />} />
          <Route path="/user/userprofile" element={<UserProfilePage darkMode={darkMode} />} />
          <Route path="/user/favorites" element={<FavoritesPage darkMode={darkMode} />} />

          {/* Redirect unknown routes based on role */}
          <Route
            path="*"
            element={
              localStorage.getItem("role") === "chef" ? (
                <Navigate to="/chef/homepage" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>

        <ScrollToTopButton darkMode={darkMode} />
        {!hideNavbar && <Footer darkMode={darkMode} />}
      </main>
    </>
  );
}

export default App;
