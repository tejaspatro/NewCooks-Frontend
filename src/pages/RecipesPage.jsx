// src/pages/RecipesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosConfig";
import "./recipe.css";
import RecipeCard from "../components/RecipeCard";
import { useLoading } from "../context/LoadingContext";
import Swal from "sweetalert2";

export default function RecipesPage({ darkMode }) {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        startLoading("Fetching all recipes...");
        setError(null);
        const response = await axiosApi.get(`/user/recipes?page=${currentPage}&size=${pageSize}`);
        setRecipes(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch recipes.");
      } finally {
        stopLoading();
      }
    }
    fetchRecipes();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
  };

  const handleFavClick = () => {
    navigate("/user/favorites")
  }

  const handleGoBack = () => {
    navigate(-1);
  }

  const handleCardClick = (recipeId) => {
    if (!role) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to view recipe details.",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      // ✅ redirect to new UserRecipeDetails page
      navigate(`/user/recipes/${recipeId}`);
    }
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
    <div className={`recipes-container bg-main bg-dots page-content${darkMode ? " dark-mode" : ""}`} style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          background: "inherit",
          zIndex: 1000,
        }}
      >
        {/* Left: Go Back Button */}
        <div>
          <button onClick={handleGoBack} className="btn btn-warning me-2">
            ← Go Back
          </button>
        </div>

        {/* Center: Title */}
        <h1
          className={`${darkMode ? "text-deep-yellow" : "text-danger"}`}
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          All Recipes
        </h1>

        {/* Right: Favorites Button */}
        <div>
          <button onClick={handleFavClick} className="btn btn-danger me-2">
            Favorites
          </button>
        </div>
      </div>


      {/* Message if no recipes */}
      {recipes.length === 0 ? (
        <p className="text-center mt-5">No recipes added yet.</p>
      ) : (
        <div className="recipes-grid mt-5">
          {recipes.map((recipe) => (
            <div key={recipe.recipeId} onClick={() => handleCardClick(recipe.recipeId)} style={{ cursor: "pointer" }}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center align-items-center gap-3 my-4">
        <button className="btn btn-warning btn-outline-warning text-black" onClick={handlePrevPage} disabled={currentPage === 0}>
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button className="btn btn-warning btn-outline-warning text-black" onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
}
