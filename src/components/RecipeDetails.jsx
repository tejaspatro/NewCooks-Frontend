// src/components/RecipeDetails.jsx
import { useState } from "react";

export default function RecipeDetails({ recipe, darkMode }) {
  const [fullscreen, setFullscreen] = useState(false);

  if (!recipe) return null;

  // Collect images
  const images = [];
  if (recipe.thumbnail) images.push(recipe.thumbnail);
  if (recipe.images && recipe.images.length > 0) {
    images.push(...recipe.images);
  }

  return (
    <div className={`recipe-details-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Recipe Images */}
      <div className="recipe-images-section">
        {images.length > 0 ? (
          <>
            <div
              id="recipeCarousel"
              className="carousel slide"
              data-bs-interval="false"   // ✅ stop auto-slide
            >
              <div className="carousel-inner">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`carousel-item ${idx === 0 ? "active" : ""}`}
                  >
                    <img
                      src={img}
                      alt={`Recipe Image ${idx + 1}`}
                      className="d-block w-100 recipe-main-image"
                      onClick={() => setFullscreen(true)} // ✅ click to open fullscreen
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#recipeCarousel"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#recipeCarousel"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>

            {/* ✅ Fullscreen Modal */}
            {fullscreen && (
              <div className="fullscreen-overlay">
                <button
                  className="close-btn"
                  onClick={() => setFullscreen(false)}
                >
                  ✕
                </button>
                <div
                  id="fullscreenCarousel"
                  className="carousel slide"
                  data-bs-interval="false"
                >
                  <div className="carousel-inner">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`carousel-item ${idx === 0 ? "active" : ""}`}
                      >
                        <img
                          src={img}
                          alt={`Fullscreen ${idx + 1}`}
                          className="fullscreen-img"
                        />
                      </div>
                    ))}
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#fullscreenCarousel"
                        data-bs-slide="prev"
                      >
                        <span className="carousel-control-prev-icon"></span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#fullscreenCarousel"
                        data-bs-slide="next"
                      >
                        <span className="carousel-control-next-icon"></span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <p>No image available</p>
        )}
      </div>

      {/* Recipe Title & Description */}
      <h1>{recipe.title}</h1>
      <p>
        <strong>Description:</strong> {recipe.description}
      </p>

      {/* Ingredients */}
      <section>
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients?.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </section>

      {/* Utensils */}
      <section>
        <h3>Utensils</h3>
        <ul>
          {recipe.utensils?.map((ut, idx) => (
            <li key={idx}>{ut}</li>
          ))}
        </ul>
      </section>

      {/* Nutrition Info */}
      <section>
        <h3>Nutrition Information</h3>
        <p>{recipe.nutritionInfo}</p>
      </section>

      {/* Instructions */}
      <section>
        <h3>Instructions</h3>
        <ol>
          {recipe.instructions?.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Ratings & Reviews */}
      <section style={{ marginTop: "1rem" }}>
        <h3>Rating</h3>
        <p>{recipe.rating ? `${recipe.rating} ⭐` : "No ratings yet"}</p>

        <h3>Reviews</h3>
        {recipe.reviews && recipe.reviews.length > 0 ? (
          <ul className="list-group">
            {recipe.reviews.map((rev, idx) => (
              <li key={idx} className="list-group-item">
                <strong>{rev.user}:</strong> {rev.comment}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </section>
    </div>
  );
}
