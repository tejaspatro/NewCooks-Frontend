// src/pages/Chef/MyRecipesPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosConfig";
import "../recipe.css";
import RecipeCard from "../../components/RecipeCard";
import { useLoading } from "../../context/LoadingContext";

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
      <h1
        className="all-recipes-heading"
        style={{ textAlign: "center", justifyContent: "center", width: "100%" }}
      >
        My Recipes
      </h1>

      {/* Add New Recipe button */}
      <button
        onClick={handleAddClick}
        className="btn btn-warning"
        style={{ position: "absolute", top: "2.5rem", right: "2rem" }}
      >
        + Add New Recipe
      </button>

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
