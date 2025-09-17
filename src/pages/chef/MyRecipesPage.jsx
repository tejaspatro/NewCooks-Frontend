// src/pages/Chef/MyRecipesPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosConfig";
import "../recipe.css";
import RecipeCard from "../../components/RecipeCard";
import { useLoading } from "../../context/LoadingContext";
import { FaPlus } from "react-icons/fa";

export default function MyRecipesPage({ darkMode }) {
  const { chefId } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const { startLoading, setProgress, stopLoading } = useLoading();

  useEffect(() => {
    async function fetchMyRecipes() {
      try {
        startLoading("Fetching your recipes...");
        const response = await axiosApi.get(`/chef/recipes`);
        setRecipes(response.data);
      } catch (err) {
        setError("Failed to fetch your recipes. Please login again!!!");
      } finally {
        stopLoading();
      }
    }
    fetchMyRecipes();
  }, [chefId]); // ✅ only depend on chefId


  const handleAddClick = () => {
    navigate(`/chef/recipes/add`);
  };

  if (error)
    return (
      <div
        className={`page-content${darkMode ? " dark-mode" : ""} bg-main text-center`}
      >
        {error}
      </div>
    );
  return (
    <div
      className={`recipes-container bg-main bg-dots page-content${darkMode ? " dark-mode" : ""}`}
      style={{ position: "relative" }}
    >
      <div
        className="d-flex justify-content-between align-items-center my-4"
      >
        {/* Left Side: Go Back Button */}
        <button
          onClick={() => window.history.back()} // Or use React Router's navigate(-1)
          className="btn btn-danger"
        >
          ← Go Back
        </button>

        {/* Center: Title */}
        <h1 className="all-recipes-heading text-center m-0">
          My Recipes
        </h1>

        {/* Right Side: Responsive Add Button */}
        <button
          onClick={handleAddClick}
          className="btn btn-warning"
        >
          {/* This text is ONLY visible on medium screens and larger */}
          <span className="d-none d-md-inline">+ Add New Recipe</span>

          {/* This "+" is ONLY visible on small screens */}
          <span className="d-md-none">+</span>
        </button>
      </div>


      {/* Message if no recipes */}
      {recipes.length === 0 ? (
        <p className="text-center mt-5">No recipes added yet.</p>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.recipeId}
              recipe={recipe}
              linkTo={`/chef/recipes/${recipe.recipeId}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
