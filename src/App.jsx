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
import UserProfilePage from "./pages/UserProfilePage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";



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
          <Route path="/chef/:chefId/recipes/:recipeId/edit" element={<EditRecipeDetailPage darkMode={darkMode}/>} />
          <Route path="/chef/chefprofile" element={<ChefProfilePage darkMode={darkMode} />} />

          <Route
            path="/chef/recipes/:recipeId"
            element={<ChefRecipeDetailPage darkMode={darkMode} />}
          />
          <Route
            path="/chef/recipes/add"
            element={<AddRecipePage darkMode={darkMode} />}
          />

          <Route
            path="/chef/recipes"
            element={
              <ProtectedRoute>
                <MyRecipesPage darkMode={darkMode}/>
              </ProtectedRoute>
            }
          />

          {/* Chef homepage testing  */},
          <Route path="/chef/homepage" element={<ChefHero darkMode={darkMode} />} />
          {/* Navbar

Hero/Profile Section (profile pic, welcome, stats)

Featured Recipes (most rated + most reviewed)

My Recipes Grid/List (with “Add Recipe”)

Insights / Analytics (charts, quick stats)

Latest Reviews

Quick Actions */}

          <Route
            path="/user/recipes/:recipeId"
            element={<UserRecipeDetailPage darkMode={darkMode} />}
          />
          <Route path="/user/userprofile" element={<UserProfilePage darkMode={darkMode} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
