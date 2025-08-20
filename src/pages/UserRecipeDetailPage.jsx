import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosApi from "../api/axiosConfig";

export default function UserRecipeDetailPage({ darkMode }) {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);
        const res = await axiosApi.get(`/user/recipes/${recipeId}`);
        setRecipe(res.data);
      } catch (err) {
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [recipeId]);

  if (loading) return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>Loading...</div>;
  if (error) return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>{error}</div>;
  if (!recipe) return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>Recipe not found</div>;

  return (
    <div className={`page-content${darkMode ? " dark-mode" : ""}`}>
      {/* Recipe image */}
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover", marginBottom: "1rem" }}
        />
      )}

      {/* Recipe details */}
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>

      {/* Simple 5-star rating widget */}
      <div>
        <span>Rate this recipe:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "2rem",
              color:
                star <= (hover || rating) ? "#ffc107" : "#e4e5e9",
            }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
