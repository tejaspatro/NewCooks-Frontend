import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
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
      {!hideNavbar && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
      <main className={`page-content ${darkMode ? "dark-mode" : ""} ${hideNavbar ? "no-padding" : ""}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage darkMode={darkMode} />} />
          <Route path="/signup" element={<SignupPage darkMode={darkMode} />} />
          <Route path="/recipes" element={<RecipesPage darkMode={darkMode} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage darkMode={darkMode} />} />
          <Route path="/chef/:chefId/recipes/:recipeId/edit" element={<EditRecipeDetailPage />} />
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
          
        </Routes>
      </main>
    </>
  );
}

export default App;
