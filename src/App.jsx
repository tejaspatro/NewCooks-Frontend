import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./style.css";
import RecipesPage from "./pages/RecipesPage";
import MyRecipesPage from "./pages/chef/MyRecipesPage";
import ChefRecipeDetailPage from "./pages/chef/ChefRecipeDetailPage";
import UserRecipeDetailPage from "./pages/UserRecipeDetailPage";
import AddRecipePage from "./pages/chef/AddRecipePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EditRecipeDetailPage from "./pages/chef/EditRecipePage";
import ChefProfilePage from "./pages/chef/ChefProfilePage";
import ChefHero from "./pages/chef/Homepage/ChefHero";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  return (
    <Router>
      <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
    </Router>
  );
}

function AppContent({ darkMode, setDarkMode }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

  return (
    <>
      <main className={`relative ${darkMode ? "dark-mode" : ""} ${hideNavbar ? "no-padding" : ""}`}>
        {!hideNavbar && <Navbar className="" darkMode={darkMode} setDarkMode={setDarkMode} />}
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/login" element={<LoginPage darkMode={darkMode} />} />
          <Route path="/signup" element={<SignupPage darkMode={darkMode} />} />
          <Route path="/recipes" element={<RecipesPage darkMode={darkMode} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage darkMode={darkMode} />} />
          <Route path="/chef/:chefId/recipes/:recipeId/edit" element={<EditRecipeDetailPage />} />
          <Route path="/chef/chefprofile" element={<ChefProfilePage darkMode={darkMode} />} />
          <Route
            path="/chef/:chefId/recipes/:recipeId"
            element={<ChefRecipeDetailPage darkMode={darkMode} />}
          />
          <Route
            path="/user/recipes/:recipeId"
            element={<UserRecipeDetailPage darkMode={darkMode} />}
          />
          <Route
            path="/chef/:chefId/recipes/add"
            element={<AddRecipePage darkMode={darkMode} />}
          />

          <Route
            path="/chef/:chefId/recipes"
            element={
              <ProtectedRoute>
                <MyRecipesPage />
              </ProtectedRoute>
            }
          />

          {/* Chef homepage testing  */},
          <Route path="/" element={<ChefHero darkMode={darkMode} />} />
          {/* Navbar

          Hero/Profile Section (profile pic, welcome, stats)

          Featured Recipes (most rated + most reviewed)

          My Recipes Grid/List (with “Add Recipe”)

          Insights / Analytics (charts, quick stats)

          Latest Reviews

          Quick Actions */}

        </Routes>
      </main>
    </>
  );
}

export default App;
