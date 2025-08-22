import { useNavigate } from "react-router-dom";
import "../pages/recipe.css"; // make sure this path is correct (adjust if needed)

export default function RecipeCard({ recipe, linkTo }) {
    const navigate = useNavigate();

    return (
        <div
            className="recipe-card-link"
            onClick={() => navigate(linkTo)}
        >
            <div className="recipe-card">
                <img
                    src={recipe.thumbnail || recipe.imageUrl || "/default.jpg"}
                    alt={recipe.title}
                    className="recipe-image"
                />

                <div className="recipe-details">
                    <div className="recipe-rating">
                        ⭐ {recipe.averageRating || "0"} ({recipe.totalRatings || 0} ratings)
                    </div>
                    <h3 className="recipe-title">{recipe.title}</h3>
                </div>
            </div>
        </div>
    );
}
