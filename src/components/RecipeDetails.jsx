import React, { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function RecipeDetails({ recipe, darkMode }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!recipe) return null;

  const images = [];
  if (recipe.thumbnail) images.push(recipe.thumbnail);
  if (recipe.images && recipe.images.length > 0) {
    images.push(...recipe.images);
  }

  return (
    <div className={`container my-5`}>
      <h1 className={`text-center mb-4 ${darkMode ? "text-warning" : "text-danger"}`} style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{recipe.title}</h1>

      <div className={`card shadow-lg mb-4 rounded-3 ${darkMode ? "bg-dark text-white" : "bg-white text-dark"}`} style={{ overflow: "hidden" }}>
        <div className="card-body p-0">
          <div className="position-relative">
            {images.length > 0 ? (
              <>
                <div
                  id="recipeCarousel"
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
                          alt={`Recipe Image ${idx + 1}`}
                          className="d-block w-100"
                          style={{ aspectRatio: "4/3", objectFit: "cover", cursor: "pointer" }}
                          onClick={() => setFullscreen(true)}
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
                        <i className="bi bi-chevron-left fs-1" style={{ color: "cyan" }}></i>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#recipeCarousel"
                        data-bs-slide="next"
                      >
                        <i className="bi bi-chevron-right fs-1" style={{ color: "cyan" }}></i>
                        <span className="visually-hidden">Next</span>
                      </button>

                    </>
                  )}
                </div>

                {fullscreen && (
                  <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
                    <div className="modal-dialog modal-fullscreen">
                      <div className="modal-content bg-transparent border-0 d-flex align-items-center justify-content-center">
                        <button
                          type="button"
                          className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3"
                          onClick={() => setFullscreen(false)}
                          aria-label="Close"
                        ></button>
                        <div
                          id="fullscreenCarousel"
                          className="carousel slide w-75"
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
                                  className="d-block w-100"
                                  style={{ objectFit: "contain", maxHeight: "90vh" }}
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
                                <i className="bi bi-chevron-left fs-1" style={{ color: "cyan" }}></i>
                                <span className="visually-hidden">Previous</span>
                              </button>
                              <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#fullscreenCarousel"
                                data-bs-slide="next"
                              >
                                <i className="bi bi-chevron-right fs-1" style={{ color: "cyan" }}></i>
                                <span className="visually-hidden">Next</span>
                              </button>

                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="p-3 text-center">No image available</p>
            )}
          </div>
        </div>
      </div>

      <div className={`card shadow-lg p-4 mb-4 rounded-3 ${darkMode ? "bg-dark text-white" : "bg-white text-dark"}`}>
        <section className="mb-4">
          <h3 className="mb-2 text-warning">Description</h3>
          <p>{recipe.description}</p>
        </section>
      </div>

      <div className={`card shadow-lg p-4 mb-4 rounded-3 ${darkMode ? "bg-dark text-white" : "bg-white text-dark"}`}>
        <div className="row g-4">
          <section className="col-md-6">
            <h3 className="mb-2 text-warning">Ingredients</h3>
            <ul className="list-group">
              {recipe.ingredients?.map((ing, idx) => (
                <li key={idx} className={`list-group-item d-flex align-items-center ${darkMode ? "text-white" : "text-dark"}`} style={{ backgroundColor: "inherit", border: "1px solid #ffdf91" }}>
                  <i className="bi bi-check-circle-fill text-warning me-2"></i>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="col-md-6">
            <h3 className="mb-2 text-warning">Utensils</h3>
            <ul className="list-group">
              {recipe.utensils?.map((ut, idx) => (
                <li key={idx} className={`list-group-item d-flex align-items-center ${darkMode ? "text-white" : "text-dark"}`} style={{ backgroundColor: "inherit", border: "1px solid #ffdf91" }}>
                  <i className="bi bi-tools text-warning me-2"></i>
                  <span>{ut}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className={`card shadow-lg p-4 mb-4 rounded-3 ${darkMode ? "bg-dark text-white" : "bg-white text-dark"}`}>
        <section className="mb-4">
          <h3 className="mb-2 text-warning">Nutrition Information</h3>
          <p>{recipe.nutritionInfo}</p>
        </section>
      </div>

      <div className={`card shadow-lg p-4 mb-4 rounded-3 ${darkMode ? "bg-dark text-white" : "bg-white text-dark"}`}>
        <section className="mb-4">
          <h3 className="mb-2 text-warning">Instructions</h3>
          <ol className="list-group list-group-numbered">
            {recipe.instructions?.map((step, idx) => (
              <li key={idx} className={`list-group-item ${darkMode ? "text-white" : "text-dark"}`} style={{ backgroundColor: "inherit", border: "1px solid #ffdf91" }}>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className={`card shadow-lg p-4 mb-4 rounded-3 ${darkMode ? "bg-dark text-white" : "bg-white text-dark"}`}>
        <section className="mb-2">
          <h3 className="mb-2 text-warning">Rating</h3>
          <p>{recipe.rating ? `${recipe.rating} ⭐` : "No ratings yet"}</p>
        </section>

        <section>
          <h3 className="mb-2 text-warning">Reviews</h3>
          {recipe.reviews && recipe.reviews.length > 0 ? (
            <ul className="list-group">
              {recipe.reviews.map((rev, idx) => (
                <li key={idx} className={`list-group-item ${darkMode ? "text-white" : "text-dark"}`} style={{ backgroundColor: "inherit", border: "1px solid #ffdf91" }}>
                  <strong>{rev.user}:</strong> {rev.comment}
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </section>
      </div>
    </div>
  );
};
