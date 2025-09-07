import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosConfig";
import Swal from "sweetalert2";
import UserRecipeDetails from "../components/UserRecipeDetails";
import HeartToggle from "../components/HeartToggle";

export default function UserRecipeDetailPage({ darkMode }) {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

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
    async function fetchRecipe() {
      showCustomLoader();

      try {
        const res = await axiosApi.get(`/user/recipes/${recipeId}`);
        setRecipe(res.data);
      } catch (err) {
        setError("Failed to fetch the recipe details. Please login again!!!");
      } finally {
        closeCustomLoader();
      }
    }

    fetchRecipe();
  }, [recipeId]);

  const handleGoBack = () => {
    showCustomLoader("Taking you back...");
    setTimeout(() => {
      navigate(-1);
      closeCustomLoader();
    }, 500); // Short delay to show loader briefly
  };

  if (error) {
    return (
      <div className={`page-content${darkMode ? " dark-mode" : ""} bg-main text-center`}>
        <h4>{error}</h4>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div
      className={`bg-main bg-dots page-content${darkMode ? " dark-mode" : ""}`}
      style={{ position: "relative", paddingBottom: "2rem" }}
    >
      {/* Top Controls */}
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
          className={`${darkMode ? "text-deep-yellow" : "text-danger"}`}
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {recipe.title}
        </h1>

        {/* Right: Heart Icon */}
        <div style={{ marginLeft: "auto" }}>
          <div style={{ cursor: "pointer", flexShrink: 0 }}>
            <HeartToggle recipeId={recipe.recipeId} darkMode={darkMode} />
          </div>
        </div>
      </div>


      {/* Recipe Details */}
      <UserRecipeDetails recipe={recipe} darkMode={darkMode} />
    </div>
  );
}
