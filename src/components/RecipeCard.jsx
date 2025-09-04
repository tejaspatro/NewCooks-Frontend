import { useNavigate } from "react-router-dom";
import "../pages/recipe.css"; // make sure this path is correct (adjust if needed)
import recipeDefaultThumbnail from "../images/recipe_thumbnail.png"
import { useState, useEffect } from "react";
import axiosApi from "../api/axiosConfig";


export default function RecipeCard({ recipe, linkTo }) {
    const navigate = useNavigate();
    const [ratingsData, setRatingsData] = useState({
          average: 0,
          total: 0,
        });

    useEffect(() => {
    async function fetchRatings() {
      try {
        const res = await axiosApi.get(`/recipes/rating/${recipe.recipeId}`);
        const data = res.data; // { average, total, counts }

        setRatingsData({
          average: data.average || 0,
          total: data.total || 0,
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (recipe?.recipeId) fetchRatings();
  }, [recipe?.recipeId]);

    return (
        <div
            className="recipe-card-link"
            onClick={() => navigate(linkTo)}
        >
            <div className="recipe-card">
                <img
                    src={recipe.thumbnail || recipe.imageUrl || recipeDefaultThumbnail}
                    alt={recipe.title}
                    className="recipe-image"
                />

                <div className="recipe-details">
                    <div className="recipe-rating">
                        ⭐ {ratingsData.average.toFixed(1)} ({ratingsData.total} ratings)
                    </div>
                    <h3 className="recipe-title">{recipe.title}</h3>
                </div>
            </div>
        </div>
    );
}
