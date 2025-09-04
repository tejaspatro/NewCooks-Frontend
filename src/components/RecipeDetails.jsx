import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./components.css";
import { useEffect } from "react";
import axiosApi from "../api/axiosConfig";
import HoverCardPortal from "./HoverReviewCardPortal";
import placeHolderImg from "../images/Profile_avatar_placeholder_large.png";

export default function RecipeDetails({ recipe, darkMode }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const [ratingsData, setRatingsData] = useState({
    average: 0,
    total: 0,
    counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    async function fetchRatings() {
      try {
        const res = await axiosApi.get(`/recipes/rating/${recipe.recipeId}`);
        const data = res.data; // { average, total, counts }

        setRatingsData({
          average: data.average || 0,
          total: data.total || 0,
          counts: data.counts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (recipe?.recipeId) fetchRatings();
  }, [recipe?.recipeId]);

  useEffect(() => {
    async function fetchReviews() {
      if (!recipe?.recipeId) return;

      try {
        const res = await axiosApi.get(`/chef/recipes/${recipe.recipeId}/reviews`);
        setReviewsData(res.data); // expects array of { user, comment }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setReviewsData([]);
      }
    }

    fetchReviews();
  }, [recipe?.recipeId]);

  const ratingPercentages = {};
  for (let i = 1; i <= 5; i++) {
    ratingPercentages[i] = ratingsData.total ? (ratingsData.counts[i] / ratingsData.total) * 100 : 0;
  }


  if (!recipe) return null;

  const images = [];
  if (recipe.thumbnail) images.push(recipe.thumbnail);
  if (recipe.images && recipe.images.length > 0) {
    images.push(...recipe.images);
  }

  // Wrapper Card Component
  const DiagonalCard = ({ children, index, darkMode }) => (
    <div
      className={`card card-glow card-glow-float shadow-lg p-4 mt-4 rounded-3 ${darkMode ? "bg-dark-glow card-grid-overlay" : "bg-light-red card-grid-overlay"
        }`}
    >
      {/* Auto diagonal glow */}
      {index % 2 === 0 ? (
        <>
          <span className="glow-float glow-float-br"></span>
          <span className="glow-corner glow-tl"></span>
        </>
      ) : (
        <>
          <span className="glow-float glow-float-bl"></span>
          <span className="glow-corner glow-tr"></span>
        </>
      )}
      {children}
    </div>
  );

  return (
    <>
      {/* Recipe Title */}
      {/* <h1
        className={`text-center mb-4 ${darkMode ? "text-deep-yellow" : "text-danger"
          }`}
        style={{ fontSize: "2.5rem", fontWeight: "bold" }}
      >
        {recipe.title}
      </h1> */}

      {/* Main card with split layout */}
      <
        >
        <DiagonalCard index={1} darkMode={darkMode}>
          <>
            <div className="row g-0">
              {/* Left side: Image carousel */}
              <div className="col-md-6 d-flex flex-column">
                <div
                  className="position-relative w-100 overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  {images.length > 0 ? (
                    <div
                      id="recipeCarousel"
                      className="carousel slide h-100"
                      data-bs-ride="carousel"
                      data-bs-interval="4000"
                      data-bs-pause="hover"
                    >
                      <div className="carousel-inner h-100">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`carousel-item h-100 ${idx === 0 ? "active" : ""
                              }`}
                          >
                            <img
                              src={img}
                              alt={`Recipe ${idx + 1}`}
                              className="d-block w-100 h-100"
                              style={{
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
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
                            <i
                              className="bi bi-chevron-left fs-1"
                              style={{ color: "#FFD700" }}
                            ></i>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#recipeCarousel"
                            data-bs-slide="next"
                          >
                            <i
                              className="bi bi-chevron-right fs-1"
                              style={{ color: "#FFD700" }}
                            ></i>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      className="p-3 d-flex align-items-center justify-content-center h-100"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)", // semi-transparent
                        backdropFilter: "blur(8px)",                 // blur effect
                        WebkitBackdropFilter: "blur(8px)",           // for Safari
                        borderRadius: "8px"                           // optional: rounded corners
                      }}
                    >
                      <p className="text-center">No image available</p>
                    </div>

                  )}
                </div>
              </div>

              {/* Right side: Description + Nutrition */}
              <div className="col-md-6 p-4 d-flex flex-column">
                <section className="mb-4 flex-grow-1">
                  <h3 className="mb-2 text-deep-yellow">Description</h3>
                  <p>{recipe.description}</p>
                </section>

                <section className="mt-auto">
                  <h3 className="mb-2 text-deep-yellow">Nutrition Information</h3>
                  <p>{recipe.nutritionInfo}</p>
                </section>
              </div>
            </div>
          </>
        </DiagonalCard>
      </>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        >
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
                data-bs-ride="carousel"
                data-bs-interval="4000"
                data-bs-pause="hover"
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
                    {/* Custom Previous Button */}
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#fullscreenCarousel"
                      data-bs-slide="prev"
                    >
                      <i
                        className="bi bi-chevron-left fs-1"
                        style={{ color: "#FFD700" }}
                      ></i>
                      <span className="visually-hidden">Previous</span>
                    </button>

                    {/* Custom Next Button */}
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#fullscreenCarousel"
                      data-bs-slide="next"
                    >
                      <i
                        className="bi bi-chevron-right fs-1"
                        style={{ color: "#FFD700" }}
                      ></i>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      )}

      {/* Sections below */}
      <div className="row g-4 mt-4">
        {/* Ingredients */}
        <div className="col-md-6">
          <DiagonalCard index={0} darkMode={darkMode}>
            <h3 className="mb-2 text-deep-yellow text-center">Ingredients</h3>
            <ul className="list-group">
              {recipe.ingredients?.map((ing, idx) => (
                <li
                  key={idx}
                  className={`list-group-item d-flex align-items-center ${darkMode ? "text-white" : "text-dark"
                    }`}
                  style={{
                    backgroundColor: "inherit",
                    border: "1px solid #ffdf91",
                  }}
                >
                  <i className="fa-solid fa-seedling text-deep-yellow me-2"></i>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </DiagonalCard>
        </div>

        {/* Utensils */}
        <div className="col-md-6">
          <DiagonalCard index={1} darkMode={darkMode}>
            <h3 className="mb-2 text-deep-yellow text-center">Utensils</h3>
            <ul className="list-group">
              {recipe.utensils?.map((ut, idx) => (
                <li
                  key={idx}
                  className={`list-group-item d-flex align-items-center ${darkMode ? "text-white" : "text-dark"
                    }`}
                  style={{
                    backgroundColor: "inherit",
                    border: "1px solid #ffdf91",
                  }}
                >
                  <i className="fa-solid fa-kitchen-set text-deep-yellow me-2"></i>
                  <span>{ut}</span>
                </li>
              ))}
            </ul>
          </DiagonalCard>
        </div>
      </div>

      {/* Instructions */}
      <DiagonalCard index={2} darkMode={darkMode}>
        <h3 className="mb-2 text-deep-yellow ">Instructions</h3>
        <ol className="list-group list-group-numbered">
          {recipe.instructions?.map((step, idx) => (
            <li
              key={idx}
              className={`list-group-item ${darkMode ? "text-white" : "text-dark"
                }`}
              style={{
                backgroundColor: "inherit",
                border: "1px solid #ffdf91",
              }}
            >
              {step}
            </li>
          ))}
        </ol>
      </DiagonalCard>

      {/* Rating */}
      <DiagonalCard index={3} darkMode={darkMode}>
        <h3 className="text-center mb-3 text-deep-yellow">Ratings</h3>

        <div className="d-flex flex-wrap" style={{ minHeight: "200px" }}>
          {/* Left: Star + Average */}
          <div
            className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-3 mb-md-0"
            style={{ borderRight: "1px solid #FFD700", paddingRight: "1rem" }}
          >
            <i
              className="bi bi-star-fill"
              style={{
                color: "#ffd500ff",
                fontSize: "8vw", // scales with viewport width
                maxHeight: "80%",
                lineHeight: 1,
                marginRight: "1rem",
                opacity: "0.9"
              }}
            ></i>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "80%" }}>
              <h3 className="mb-1">Average Rating</h3>
              <h5 className="mb-0">{ratingsData.average.toFixed(1)} / {ratingsData.total} Ratings</h5>
            </div>

          </div>

          {/* Right: Bars */}
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center ps-md-3">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="d-flex align-items-center mb-2">
                <span className="me-2">{star} ⭐</span>
                <div className="flex-grow-1 bg-secondary rounded position-relative" style={{ height: "20px", minWidth: "50px" }}>
                  <div
                    className="bg-warning rounded"
                    style={{ width: `${ratingPercentages[star]}%`, height: "100%" }}
                  ></div>
                  <span style={{ position: "absolute", right: "5px", top: 0, fontSize: "0.8rem", }}>
                    {ratingsData.counts[star] || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DiagonalCard>



      {/* Reviews */}
      <DiagonalCard index={4} darkMode={darkMode}>
        <h3 className="mb-2 text-deep-yellow">Reviews</h3>
        {reviewsData.length > 0 ? (
          <ul className="list-group">
            {reviewsData.map((rev, idx) => (
              <li
                key={idx}
                className={`list-group-item ${darkMode ? "text-white" : "text-dark"}`}
                style={{ backgroundColor: "inherit", border: "1px solid #ffdf91" }}
              >
                <div className="d-flex align-items-start">
                  {/* Avatar + Hover card (PORTAL) */}
                  <HoverCardPortal
                    darkmode={darkMode}
                    renderContent={() => (
                      <div>
                        <img
                          src={rev.profilePicture || placeHolderImg}
                          alt={rev.userName || "User"}
                          className="review-tooltip-avatar"
                        />
                        <p className="review-tooltip-name">{rev.userName || "Anonymous"}</p>
                        <p className="review-tooltip-about">
                          {rev.aboutMe || "No details"}
                        </p>
                      </div>
                    )}
                  >
                    <img
                      src={rev.profilePicture || placeHolderImg}
                      alt={rev.userName || "User"}
                      className="rounded-circle"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        cursor: "pointer",
                        borderRadius: "100%",
                        border: "3px solid #ff8d45ff",
                      }}
                    />
                  </HoverCardPortal>

                  {/* Text content */}
                  <div className="flex-grow-1 ms-3">
                    <strong>{rev.userName || "Anonymous"}</strong>
                    <p className="mb-0" style={{ marginTop: "0.25rem" }}>
                      {rev.reviewText}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </DiagonalCard>






    </>
  );
}
