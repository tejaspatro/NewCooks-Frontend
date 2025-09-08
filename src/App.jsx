import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage/HomePage";
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
import ScrollToTopButton from "./components/ScrollToTopButton";
import HelpPage from "./pages/Help";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import FavoritesPage from "./pages/Favouritespage";




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

          {/* universal pages */}
          <Route path="/login" element={<LoginPage darkMode={darkMode} />} />
          <Route path="/signup" element={<SignupPage darkMode={darkMode} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage darkMode={darkMode} />} />
          <Route path="/help" element={<HelpPage darkMode={darkMode} />} />
          <Route path="/about" element={<AboutPage darkMode={darkMode} />} />


          {/* chef pages */}
          <Route path="/chef/homepage" element={<ChefHero darkMode={darkMode} />} />
          <Route path="/chef/recipes/:recipeId/edit" element={<EditRecipeDetailPage darkMode={darkMode} />} />
          <Route path="/chef/chefprofile" element={<ChefProfilePage darkMode={darkMode} />} />
          <Route path="/chef/recipes/:recipeId" element={<ChefRecipeDetailPage darkMode={darkMode} />}/>
          <Route path="/chef/recipes/add" element={<AddRecipePage darkMode={darkMode} />}/>
          <Route path="/chef/recipes" element={
            <ProtectedRoute>
                <MyRecipesPage darkMode={darkMode} />
              </ProtectedRoute>
            }/>

          {/* user pages */}
          <Route path="/" element={<HomePage darkMode={darkMode}/>} />
          <Route path="/user/recipes/:recipeId" element={<UserRecipeDetailPage darkMode={darkMode} />} />
          <Route path="/recipes" element={<RecipesPage darkMode={darkMode} />} />
          <Route path="/user/userprofile" element={<UserProfilePage darkMode={darkMode} />} />
          <Route path="/user/favorites" element={<FavoritesPage darkMode={darkMode} />} />
        </Routes>


        <ScrollToTopButton darkMode={darkMode} />
        {/* Footer (only show when not on login/signup/forgot-password) */}
        {<Footer darkMode={darkMode} />}
      </main>
    </>
  );
}

export default App;
