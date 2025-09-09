import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.css";
import axiosApi from "../api/axiosConfig";
import Swal from "sweetalert2";
import placeHolderImg from "../images/Profile_avatar_placeholder_large.png";
import "./components.css";
import HoverCardPortal from "./HoverReviewCardPortal";
import HeartToggle from "./HeartToggle";

export default function UserRecipeDetails({ recipe, darkMode }) {
    const [fullscreen, setFullscreen] = useState(false);
    const [reviewsData, setReviewsData] = useState([]);
    const [ratingsData, setRatingsData] = useState({
        average: 0,
        total: 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    });
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");
    const [existingReview, setExistingReview] = useState(null);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const reviewRef = useRef(null);
    const [chefProfile, setChefProfile] = useState(null);


    const role = localStorage.getItem("role"); // "user" or "chef"

    const ratingPercentages = {};
    for (let i = 1; i <= 5; i++) {
        ratingPercentages[i] = ratingsData.total
            ? (ratingsData.counts[i] / ratingsData.total) * 100
            : 0;
    }

    useEffect(() => {
        if (recipe?.chef?.id) {
            axiosApi.get(`/chef/chef-public-profile?chefId=${recipe.chef.id}`)
                .then(res => setChefProfile(res.data))
                .catch(() => setChefProfile(null));
        }
    }, [recipe?.chef?.id]);

    useEffect(() => {
        if (isEditingReview) {
            // put focus back after any re-render / fetch
            setTimeout(() => {
                const el = reviewRef.current;
                if (el) {
                    el.focus();
                    // move caret to end
                    const len = el.value.length;
                    el.setSelectionRange(len, len);
                }
            }, 0);
        }
    }, [isEditingReview]);


    // Fetch ratings + user rating
    useEffect(() => {
        if (!recipe?.recipeId) return;

        async function fetchRatings() {
            try {
                const res = await axiosApi.get(`/recipes/rating/${recipe.recipeId}`);
                setRatingsData({
                    average: res.data.average || 0,
                    total: res.data.total || 0,
                    counts: res.data.counts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                });

                if (role === "user") {
                    const userRatingRes = await axiosApi.get(
                        `/user/recipes/user-rating/${recipe.recipeId}`
                    );
                    setUserRating(userRatingRes.data.stars || 0);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchRatings();
    }, [recipe?.recipeId, role]);

    // Fetch reviews + user review
    useEffect(() => {
        if (!recipe?.recipeId) return;

        async function fetchReviews() {
            try {
                const res = await axiosApi.get(`/user/reviews/${recipe.recipeId}`);
                setReviewsData(res.data);

                if (role === "user") {
                    const userReviewRes = await axiosApi.get(`/user/recipes/my-review/${recipe.recipeId}`);
                    setExistingReview(userReviewRes.data || null);

                    // Update only when not editing
                    if (!isEditingReview) {
                        setUserReview(userReviewRes.data?.reviewText || "");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch reviews", err);
                setReviewsData([]);
            }
        }

        fetchReviews();
    }, [recipe?.recipeId, role, isEditingReview]); // ✅ added isEditingReview



    // ---------------- USER ACTIONS (only active if role === "user") ----------------
    const handleRatingSubmit = async (stars) => {
        if (role !== "user") return;
        try {
            await axiosApi.post(`/user/ratings/${recipe.recipeId}`, { stars });
            Swal.fire("Success", `You rated this recipe ${stars} stars!`, "success");
            setUserRating(stars);

            // Refresh stats
            const res = await axiosApi.get(`/recipes/rating/${recipe.recipeId}`);
            setRatingsData(res.data);
        } catch (err) {
            Swal.fire("Error", "Failed to submit rating.", "error");
        }
    };

    const handleRatingRemove = async () => {
        if (role !== "user") return;
        try {
            await axiosApi.delete(`/user/ratings/${recipe.recipeId}`);
            Swal.fire("Success", "Your rating has been removed.", "success");
            setUserRating(0);

            // Refresh stats
            const res = await axiosApi.get(`/recipes/rating/${recipe.recipeId}`);
            setRatingsData(res.data);
        } catch (err) {
            Swal.fire("Error", "Failed to remove rating.", "error");
        }
    };

    const handleReviewSubmit = async () => {
        if (role !== "user") return;
        const text = reviewRef.current?.value.trim() || "";
        if (!text) {
            Swal.fire("Error", "Review cannot be empty.", "error");
            return;
        }

        try {
            const res = await axiosApi.post(`/user/reviews/${recipe.recipeId}`, {
                reviewText: text,
            });
            Swal.fire("Success", "Review submitted!", "success");
            setExistingReview(res.data);
            setIsEditingReview(false);

            const refresh = await axiosApi.get(`/user/reviews/${recipe.recipeId}`);
            setReviewsData(refresh.data);
        } catch (err) {
            Swal.fire("Error", "Failed to submit review.", "error");
        }
    };

    const handleReviewUpdate = async () => {
        if (role !== "user") return;
        const text = reviewRef.current?.value.trim() || "";
        if (!text) {
            Swal.fire("Error", "Review cannot be empty.", "error");
            return;
        }

        try {
            await axiosApi.post(`/user/reviews/${recipe.recipeId}`, {
                reviewText: text,
            });
            Swal.fire("Success", "Review updated!", "success");
            setIsEditingReview(false);

            const refresh = await axiosApi.get(`/user/reviews/${recipe.recipeId}`);
            setReviewsData(refresh.data);
        } catch (err) {
            Swal.fire("Error", "Failed to update review.", "error");
        }
    };

    const handleReviewDelete = async () => {
        if (role !== "user" || !existingReview?.id) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete your review?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await axiosApi.delete(`/user/reviews/${existingReview.id}`);
                Swal.fire("Deleted", "Your review was deleted.", "success");

                setUserReview("");
                setExistingReview(null);
                setIsEditingReview(false);

                const refresh = await axiosApi.get(`/user/reviews/${recipe.recipeId}`);
                setReviewsData(refresh.data);
            } catch (err) {
                Swal.fire("Error", "Failed to delete review.", "error");
            }
        }
    };

    if (!recipe) return null;

    const images = [];
    if (recipe.thumbnail) images.push(recipe.thumbnail);
    if (recipe.images?.length > 0) images.push(...recipe.images);

    const DiagonalCard = ({ children, index, style }) => (
        <div
            className={`card card-glow card-glow-float shadow-lg p-4 mt-4 rounded-3 ${darkMode ? "bg-dark-glow card-grid-overlay" : "bg-light-red card-grid-overlay"
                }`}
            style={style}
        >
            {children}
        </div>
    );

    return (
        <>
            {/* Recipe Title */}
            {/* <h1
                className={`text-center mb-4 ${darkMode ? "text-deep-yellow" : "text-danger"}`}
                style={{ fontSize: "2.5rem", fontWeight: "bold" }}
            >
                {recipe.title}
            </h1> */}

            {/* Main card */}
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
                                        <button className="carousel-control-prev" type="button" data-bs-target="#fullscreenCarousel" data-bs-slide="prev">
                                            <i className="bi bi-chevron-left fs-1" style={{ color: "#FFD700" }}></i>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#fullscreenCarousel" data-bs-slide="next">
                                            <i className="bi bi-chevron-right fs-1" style={{ color: "#FFD700" }}></i>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* chef details for user */}
            {role === "user" && chefProfile && (<DiagonalCard index={0} darkMode={darkMode} style={{ width: "fit-content" }}>

                <div
                    className="d-flex align-items-center mb-3"
                    style={{
                        gap: "1rem",
                        flexWrap: "nowrap",      // prevent overflow on small screens
                        justifyContent: "flex-start",
                    }}
                >
                    {/* Avatar + Hover Card */}
                    <div
                        className="position-relative"
                        style={{
                            width: "90px",
                            height: "90px",
                            cursor: "pointer",
                            flexShrink: 0,        // prevent shrinking
                        }}
                    >
                        <HoverCardPortal
                            darkmode={darkMode}
                            renderContent={() => (
                                <div
                                    style={{
                                        maxWidth: 260,
                                        padding: "0.5rem",
                                        wordWrap: "break-word",
                                    }}
                                >
                                    <div>
                                        <strong>Experience:</strong> {chefProfile.experience || "NOT ADDED"}
                                    </div>
                                    <div>
                                        <strong>Bio:</strong> {chefProfile.bio || "NOT ADDED"}
                                    </div>
                                </div>
                            )}
                            portalStyle={{ left: "0", right: "auto" }} // keeps tooltip from going offscreen
                        >
                            <img
                                src={chefProfile.profilePicture || placeHolderImg}
                                alt={chefProfile.name || "Chef"}
                                className="review-tooltip-avatar"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </HoverCardPortal>
                    </div>

                    {/* Text Content */}
                    <div
                        className="d-flex"
                        style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",   // optional: ensure container has height for vertical centering
                        }}
                    >
                        <h3 className="text-deep-yellow mb-1" style={{ margin: 0 }}>
                            Chef
                        </h3>
                        <span
                            className={`fw-bold ${darkMode ? "text-light" : "text-dark"}`}
                        >
                            Name: {chefProfile.name}
                        </span>
                        <small className={darkMode ? "text-light" : "text-muted"}>
                            Expertise: {chefProfile.expertise}
                        </small>
                    </div>
                </div>

            </DiagonalCard>)}

            {/* Ingredients and Utensils */}
            <div className="row g-4 ">
                <div className="col-md-6">
                    {/* Ingredients */}
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

            {/* Ratings */}
            <DiagonalCard index={3}>
                <h3 className="text-center mb-3 text-deep-yellow">Ratings</h3>
                <div className="d-flex flex-wrap" style={{ minHeight: "200px" }}>
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-3 mb-md-0">
                        <i
                            className="bi bi-star-fill"
                            style={{
                                color: "#ffd500",
                                fontSize: "8vw",
                                maxHeight: "80%",
                                marginRight: "1rem",
                            }}
                        ></i>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h3 className="mb-1">Average Rating</h3>
                            <h5>
                                {ratingsData.average.toFixed(1)} / {ratingsData.total} Ratings
                            </h5>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 d-flex flex-column justify-content-center ps-md-3">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="d-flex align-items-center mb-2">
                                <span className="me-2">{star} ⭐</span>
                                <div
                                    className="flex-grow-1 bg-secondary rounded position-relative"
                                    style={{ height: "20px", minWidth: "50px" }}
                                >
                                    <div
                                        className="bg-warning rounded"
                                        style={{
                                            width: `${ratingPercentages[star]}%`,
                                            height: "100%",
                                        }}
                                    ></div>
                                    <span
                                        style={{
                                            position: "absolute",
                                            right: "5px",
                                            top: 0,
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {ratingsData.counts[star] || 0}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Rating (only if role is user) */}
                {role === "user" && (
                    <div className="mt-3">
                        <span className="me-2">Your Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`bi bi-star${star <= userRating ? "-fill" : ""}`}
                                style={{
                                    color: star <= userRating ? "#ffc107" : "#e4e5e9",
                                    cursor: "pointer",
                                    fontSize: "2rem",
                                }}
                                onClick={() => handleRatingSubmit(star)}
                            ></i>
                        ))}
                        {userRating > 0 && (
                            <button
                                className="btn btn-danger btn-sm ms-3"
                                onClick={handleRatingRemove}
                            >
                                Remove Rating
                            </button>
                        )}
                    </div>
                )}
            </DiagonalCard>

            {/* Reviews */}
            <DiagonalCard index={4}>
                <h3 className="mb-2 text-deep-yellow">Reviews</h3>

                {/* Review box only for users */}
                {role === "user" && (
                    <div className="mb-3">
                        <textarea
                            id="userReview"
                            name="userReview"
                            ref={reviewRef}
                            className={`form-control ${darkMode ? "bg-dark text-light" : " "}`}
                            rows="3"
                            defaultValue={existingReview?.reviewText || ""}
                            placeholder="Write your review here..."
                            readOnly={!isEditingReview && !!existingReview?.reviewText}
                        />
                        {!existingReview || !existingReview.reviewText || existingReview.reviewText.trim() === "" ? (
                            <button className="btn btn-warning mt-2" onClick={handleReviewSubmit}>
                                Submit Review
                            </button>
                        ) : (
                            <div className="d-flex justify-content-end mt-2">
                                {!isEditingReview ? (
                                    <>
                                        <button
                                            className="btn btn-warning me-2"
                                            onClick={() => setIsEditingReview(true)}
                                        >
                                            Edit Review
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={handleReviewDelete}
                                        >
                                            Delete Review
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-warning me-2"
                                            onClick={handleReviewUpdate}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setIsEditingReview(false);
                                                setUserReview(existingReview?.reviewText ?? "");
                                            }}

                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

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
                    <p>No reviews yet.</p>
                )}
            </DiagonalCard>
        </>
    );
}
