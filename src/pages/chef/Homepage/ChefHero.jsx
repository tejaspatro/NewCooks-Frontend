import { useEffect, useState } from "react";
import axiosApi from "../../../api/axiosConfig";
import chefheroimage from "../../../images/Chef/chef_hero.jpg";
import placeHolderImg from "../../../images/Profile_avatar_placeholder_large.png";
import "./homepage.css";

export default function ChefHero() {
  const [chefData, setChefData] = useState(null);
  const [mostRated, setMostRated] = useState([]);
  const [mostReviewed, setMostReviewed] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);

  useEffect(() => {
    async function fetchChef() {
      try {
        const res = await axiosApi.get("/chef/chefprofile");
        setChefData(res.data);

        const rated = await axiosApi.get("/recipes/most-rated");
        setMostRated(rated.data);

        const reviewed = await axiosApi.get("/recipes/most-reviewed");
        setMostReviewed(reviewed.data);

        const myRec = await axiosApi.get("/chef/myrecipes");
        setMyRecipes(myRec.data);

        const reviews = await axiosApi.get("/chef/latest-reviews");
        setLatestReviews(reviews.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchChef();
  }, []);

  return (
    <>
      {/* chef hero part */}
      <section className="position-relative vh-100 w-100 d-flex align-items-center justify-content-center text-center overflow-hidden hero-section">
        {/* Background image with gradient */}
        <div className="position-absolute backdrop-blur top-0 start-0 w-100 h-100 overflow-hidden">
          <img
            src={chefheroimage}
            alt="Chef Cooking"
            className="w-100 h-100"
            style={{ objectFit: "", filter: "brightness(40%)" }}
          />
          <div className="hero-gradient"></div>
        </div>

        {/* Profile Picture (top-right corner) */}
        <a href="/chef/chefprofile" className="position-absolute top-0 end-0 m-3">
          <img
            src={chefData?.profilePicture || placeHolderImg}
            alt="Profile"
            className="profile-pic"
          />
        </a>

        {/* Center Content */}
        <div className="position-relative z-1 px-3 animate-fadeIn container-fluid">
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

      {/* featured recipe part */}
      <section className="position-relative vh-100 w-100 d-flex align-items-center justify-content-center text-center overflow-hidden hero-section">
        <h2 className="fw-bold mb-4 text-center">💬 Most Reviewed Recipes</h2>
        <div className="row g-4">
          {mostReviewed.map((recipe) => (
            <div key={recipe.id} className="col-md-4">
              <div className="card recipe-card h-100">
                <img
                  src={recipe.image || placeHolderImg}
                  alt={recipe.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p className="card-text text-muted">
                    {recipe.reviewsCount} Reviews
                  </p>
                  <a href={`/recipes/${recipe.id}`} className="btn btn-danger">
                    View Recipe
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* browse to my recipe page */}
      <section className="bg-success position-relative inset-0 bg-gradient-to-br from-blue-600/30 to-transparent d-flex align-items-center justify-content-center text-center overflow-hidden ">
          <div>
            <h2>hey chef</h2><br />
            <h3>we can get started already</h3><br />
            <h6>your recipes button  add a recipe button</h6> 
          </div>
      </section>

      {/* analytics */}
      <section className="position-relative vh-100 w-100 d-flex align-items-center justify-content-center text-center overflow-hidden hero-section">
            <div>
              here are your analytics.
              <>here we can add total recipes. average reviews per recipe. average rating for you(total rating/total recipes)</>
            </div>
      </section>

      {/* latest reviews */}
      <section className="bg-danger position-relative vh-100 w-100 d-flex align-items-center justify-content-center text-center overflow-hidden hero-section">
          we will make 3 cards for this part. each will be a clickable link. we will have profile pics at top center, name below it, necipe name and the review written in the card
      </section>

      {/* quick actions */}
      <section className="position-relative vh-100 w-100 d-flex align-items-center justify-content-center text-center overflow-hidden hero-section">
          leave this for now.
      </section>
    </>
  );
}
