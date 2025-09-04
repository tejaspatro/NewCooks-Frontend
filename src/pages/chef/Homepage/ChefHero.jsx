import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosApi from "../../../api/axiosConfig";
import chefheroimage from "../../../images/Chef/chefhero/chef_hero_hd.png";
import chefherovideo from "../../../images/Chef/chefhero/perplexity_Clipchamp.mp4";
import placeHolderImg from "../../../images/Profile_avatar_placeholder_large.png";
import recipePlaceHolder from "../../../images/recipe_thumbnail.png";
import "./homepage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FaBookOpen, FaStar, FaComments } from "react-icons/fa";

export default function ChefHero({ darkMode }) {
  const [chefData, setChefData] = useState(null);
  const [mostReviewed, setMostReviewed] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function fetchChef() {
      try {
        const [chefRes, reviewedRes, analyticsRes] = await Promise.all([
          axiosApi.get("/chef/chefprofile"),
          axiosApi.get("/recipes/most-reviewed"),
          axiosApi.get("/chef/analytics")
            .then(res => setAnalytics(res.data))
            .catch(err => console.log(err))
        ]);
  setChefData(chefRes.data);
  setMostReviewed(reviewedRes.data);
} catch (err) {
  console.error(err);
}
    }
fetchChef();
  }, []);

useEffect(() => {
  setAnimationKey(prevKey => prevKey + 1);
}, [darkMode]);

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 800,
  slidesToShow: 3,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  responsive: [
    { breakpoint: 768, settings: { slidesToShow: 1, centerMode: false } }
  ],
};


return (
  <>
    {/* chef hero part */}
    <section className={`${darkMode ? "dark-mode" : ""} position-relative vh-100 w-100 d-flex align-items-center justify-content-center text-center overflow-hidden hero-section`}>
      {/* Background image with gradient */}
      <div className="position-absolute backdrop-blur top-0 start-0 w-100 h-100 overflow-hidden">
        <div className="video-wrapper">
          <div className="hero-background-videos">
            <div className="hero-background-videos">
              <video
                id="heroVideo"
                className="hero-video"
                src={chefherovideo}
                autoPlay
                muted
                playsInline
                onEnded={(e) => { e.target.play(); }} // manual loop
              />

            </div>

          </div>
        </div>


        <div key={animationKey} className="hero-gradient gradient-animate"></div>
      </div>

      {/* Profile Picture (top-right corner) */}
      <a href="/chef/chefprofile" className="position-absolute top-0 end-0 m-3 animate-fadeIn">
        <img
          src={chefData?.profilePicture || placeHolderImg}
          alt="Profile"
          className="profile-pic"
        />
      </a>

      {/* Center Content */}
      <div key={animationKey} className="position-relative z-1 px-3 animate-fadeIn container-fluid">
        <h1 className="display-3 fw-bold text-white lh-tight text-shadow">
          Welcome to <span style={{ color: "" }} className="text-danger">NewCooks</span> Chef
        </h1>
        <p className="mt-3 fs-5 text-light">
          Inspire the world with your recipes. Teach, share, and shine with us.
        </p>

        <div className="mt-4 d-flex justify-content-center">
          <a href="/about" className="hero-btn">
            About Us
          </a>
        </div>
      </div>
    </section>

    {/* Starter and Most Reviewed Recipes Section */}
    <section className={`chef-homepage-reviews container-fluid py-5`}>
      <div className="text-center mb-5">
        <h1
          className="mb-2 text-danger"
          style={{
            // color: "#ff1010ff",
            fontWeight: 800,
            fontSize: "3.5rem",
            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
            marginTop: "1.0rem"
          }}
        >
          Ready to Cook, Chef?
        </h1>
        <h3
          className="mb-4"
          style={{
            color: "#ff8c00ff",
            fontWeight: 600,
            fontSize: "1.95rem",
            textShadow: "1px 1px 6px rgba(0,0,0,0.1)",
            marginTop: "2.0rem"
          }}
        >
          Let’s whip up something <br /> amazing today!
        </h3>

        {/* Buttons */}
        <div className="d-flex justify-content-center gap-3 mb-4" style={{ marginTop: "2.55rem" }}>
          <Link to="/chef/recipes/add" className="btn btn-primary px-4 py-2 text-white hero-btn">
            Add a Recipe
          </Link>
          <Link to="/chef/recipes" className="btn btn-warning px-4 py-2 hero-btn">
            Your Recipes
          </Link>
        </div>

        {/* Divider with pan icon and smoke */}
        <div className="chef-divider d-flex align-items-center justify-content-center mt-5">
          <div className="divider-line"></div>
          <div className="pan-container">
            <i className="bi bi-basket2-fill pan-icon"></i>
            <div className="smoke">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="divider-line"></div>
        </div>
      </div>

      <h2 style={{ color: "#ff005dff", marginTop: "-2rem" }} className="fw-bold text-center mb-4">
        Your Most Reviewed Recipes
      </h2>

      {mostReviewed.length > 0 ? (
        <Slider {...sliderSettings} className="chef-homepage-reviews-slider">
          {mostReviewed.map((recipe) => (
            <div key={recipe.recipeId} className="px-3">
              <Link to={`/chef/recipes/${recipe.recipeId}`} className="text-decoration-none">
                <div className={`chef-homepage-review-card ${darkMode ? "chef-homepage-review-card-dark" : "chef-homepage-review-card-light"}`}>
                  <img
                    src={recipe.thumbnail || recipePlaceHolder}
                    alt={recipe.title}
                    className="chef-homepage-review-card-img"
                  />
                  <div className="chef-homepage-review-card-body">
                    <h5 className="fw-bold mb-2" style={{ color: "#1dff04ff" }}>{recipe.title}</h5>
                    <p style={{ color: "#00f6feff" }}><i className="bi bi-chat-dots me-2"></i> {recipe.totalReviews || 0} Reviews</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      ) : (
        <p className={`text-center text-dark`}>No reviewed recipes found.</p>
      )}
    </section>

    {/* analytics */}
    <section className="chef-analytics-section container py-5">
      <h2 className="text-center mb-5 text-primary">Your Analytics</h2>

      {/* Cards */}
      <div className="row justify-content-center g-4 mb-5">
        <div className="col-md-3">
          <div className="analytics-card p-4 text-center shadow rounded bg-gradient-primary text-white">
            <FaBookOpen size={40} className="mb-2" />
            <h3 className="display-4">{analytics?.totalRecipes ?? 0}</h3>
            <p>Total Recipes</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="analytics-card p-4 text-center shadow rounded bg-gradient-warning text-white">
            <FaComments size={40} className="mb-2" />
            <h3 className="display-4">{analytics?.avgReviews?.toFixed(1) ?? 0}</h3>
            <p>Avg Reviews per Recipe</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="analytics-card p-4 text-center shadow rounded bg-gradient-danger text-white">
            <FaStar size={40} className="mb-2" />
            <h3 className="display-4">{analytics?.avgRating?.toFixed(1) ?? 0}</h3>
            <p>Avg Rating per Recipe</p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="analytics-chart shadow p-4 rounded bg-light">
        <h4 className="text-center mb-4">Top 5 Most Reviewed Recipes</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mostReviewed} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalReviews" fill="#FF005D" radius={[5,5,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>

    {/* latest reviews */}
    <section className="bg-danger position-relative vh-100 w-100 d-flex align-items-center justify-content-center text-center overflow-hidden hero-section">
      we will make 3 cards for this part. we will have profile pics at top center, name below it, review of our website written
    </section>

    {/* quick actions */}
    <section className="position-relative vh-100 w-100 d-flex align-items-center justify-content-center text-center overflow-hidden hero-section">
      leave this for now.
    </section>
  </>
);
}
