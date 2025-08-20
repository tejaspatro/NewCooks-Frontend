import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosApi from "../api/axiosConfig"; // Import the new Axios instance
import "./recipe.css";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 16;

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        // axiosApi automatically adds the token for this protected endpoint
        const response = await axiosApi.get(`/recipes?page=${currentPage}&size=${pageSize}`);
        setRecipes(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch recipes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const renderHeading = () => {
    if (currentPage === 0) {
      return <h1 className="all-recipes-heading">All Recipes</h1>;
    } else {
      return <h1 className="all-recipes-heading">All Recipes, Page {currentPage + 1}</h1>;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="recipes-container">
      {renderHeading()}
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <Link to={`/recipes/${recipe.recipeId}`} key={recipe.recipeId} className="recipe-card-link">
            <div className="recipe-card">
              <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image"/>
              <div className="recipe-details">
                <div className="recipe-rating">
                  ⭐ {recipe.averageRating || "0"} ({recipe.totalRatings || 0} ratings)
                </div>
                <h3 className="recipe-title">{recipe.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={currentPage === i ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          &gt;
        </button>
      </div>
    </div>
  );
}
