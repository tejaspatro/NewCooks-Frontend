// src/pages/FavoritesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosConfig";
import "./recipe.css";
import RecipeCard from "../components/RecipeCard";
import Swal from "sweetalert2";

export default function FavoritesPage({ darkMode }) {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const showCustomLoader = (message = "Loading recipe details...") => {
        Swal.fire({
            title: 'Loading...',
            html: `
        <div class="cooking-loader">
          <div class="pot">
            <div class="lid"></div>
            <div class="steam steam1"></div>
            <div class="steam steam2"></div>
            <div class="steam steam3"></div>
          </div>
          <div class="loader-text">Cooking in progress...</div>
          <div class="progress-container">
            <div id="swal-progress-bar" class="progress-bar" style="width: 0%"></div>
          </div>
        </div>
      `,
            showConfirmButton: false,
            allowOutsideClick: false,
            background: '#ff6d6dff',  // Dark background color
            color: '#fff',       // White text color
            didOpen: () => {
                Swal.showLoading();
            }
        });

    };

    const closeCustomLoader = () => Swal.close();

    useEffect(() => {
        async function fetchFavorites() {
            showCustomLoader();
            try {
                setError(null);
                const res = await axiosApi.get("/user/favourites");
                setRecipes(res.data);
            } catch (err) {
                setError("Failed to fetch favorite recipes.");
            } finally {
                closeCustomLoader();
            }
        }

        fetchFavorites();
    }, []);

    const handleGoBack = () => {
        showCustomLoader();
        setTimeout(() => {
            navigate(-1);
            closeCustomLoader();
        }, 500); // Short delay to show loader briefly
    };

    const handleCardClick = (recipeId) => {
        const role = localStorage.getItem("role");
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
            navigate(`/user/recipes/${recipeId}`);
        }
    };

    if (error)
        return (
            <div className={`page-content${darkMode ? " dark-mode" : ""} bg-main text-center`}>
                {error}
            </div>
        );

    return (
        <div
            className={`recipes-container bg-main bg-dots page-content${darkMode ? " dark-mode" : ""}`}
            style={{ position: "relative" }}
        >
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
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
                    className={`text-center ${darkMode ? "text-deep-yellow" : "text-danger"}`}
                    style={{
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        margin: "auto",  // Use auto left & right margins
                        display: "block",     // Ensure it behaves as a block element
                        textAlign: "center",
                        transform: "translateX(-25px)",
                    }}
                >
                    Favorite Recipes
                </h1>


            </div>


            {recipes.length === 0 ? (
                <p className="text-center mt-5">No favorite recipes yet.</p>
            ) : (
                <div className="recipes-grid mt-5">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.recipeId}
                            onClick={() => handleCardClick(recipe.recipeId)}
                            style={{ cursor: "pointer" }}
                        >
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
