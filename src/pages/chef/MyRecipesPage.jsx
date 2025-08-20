import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import axiosApi from "../../api/axiosConfig";
import "../recipe.css"; // Reuse the same CSS file

export default function MyRecipesPage() {
  const { chefId } = useParams(); // Get chefId from the URL
  const navigate = useNavigate(); // Added navigate for button
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMyRecipes() {
      try {
        setLoading(true);
        // Fetch recipes for the specific chef
        const response = await axiosApi.get(`/chef/${chefId}/recipes`);
        setRecipes(response.data);
      } catch (err) {
        setError("Failed to fetch your recipes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyRecipes();
  }, [chefId]);

  const handleAddClick = () => {
    navigate(`/chef/${chefId}/recipes/add`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="recipes-container" style={{ position: "relative" }}>
      <h1 className="all-recipes-heading" style={{ display: "inline-block" }}>
        My Recipes
      </h1>

      {/* Add New Recipe button */}
      <button
        onClick={handleAddClick}
        className="btn btn-warning"
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
      >
        + Add New Recipe
      </button>

      {/* Message if no recipes */}
      {recipes.length === 0 ? (
        <p className="text-center mt-5">No recipes added yet.</p>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <Link
              to={`/chef/${chefId}/recipes/${recipe.recipeId}`}
              key={recipe.recipeId}
              className="recipe-card-link"
            >
              <div className="recipe-card">
                <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
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
      )}
    </div>
  );
}
