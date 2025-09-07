import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosConfig";
import Swal from "sweetalert2";
import RecipeDetails from "../../components/RecipeDetails";
import { useLoading } from "../../context/LoadingContext";
import UserRecipeDetails from "../../components/UserRecipeDetails";

export default function ChefRecipeDetailPage({ darkMode }) {
  const { chefId, recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  // Fetch recipe
  useEffect(() => {
    async function fetchRecipe() {
      startLoading("Fetching recipe details...");
      try {
        const res = await axiosApi.get(`/chef/recipes/${recipeId}`);
        setRecipe(res.data);
      } catch (err) {
        setError("Failed to load recipe. Please log in again!!!");
        console.error(err);
      } finally {
        stopLoading();
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [recipeId]);

  // Go Back handler
  const handleGoBack = () => {
    startLoading("Taking you back...");
    setTimeout(() => {
      navigate(`/chef/recipes`);
      stopLoading();
    }); // small delay so loader shows briefly
  };

  // Edit handler
  const handleEdit = (e) => {
    if (deleting) {
      e.preventDefault();
      return;
    }
    startLoading("Opening edit page...");
    setTimeout(() => {
      navigate(`/chef/recipes/${recipeId}/edit`);
      stopLoading();
    });
  };

  // Delete handler
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this recipe?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setDeleting(true);
      startLoading("Deleting your recipe...");
      try {
        await axiosApi.delete(`/chef/recipes/${recipeId}`);

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your recipe has been deleted.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: undefined,
        });

        navigate(`/chef/recipes`);
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: "Something went wrong while deleting the recipe.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: undefined,
        });
        console.error(err);
      } finally {
        setDeleting(false);
        stopLoading();
      }
    }

  };

  if (error)
    return (
      <div
        className={`page-content${darkMode ? " dark-mode" : ""} bg-main text-center`}
      >
        {error}
      </div>
    );
  if (!recipe)
    return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>Recipe not found</div>;

  return (
    <div
      className={`bg-main bg-dots page-content${darkMode ? " dark-mode" : ""}`}
      style={{ position: "relative", paddingBottom: "2rem" }}
    >
      {/* Top Controls */}
      <div
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "inherit",
          padding: "0.5rem 1rem",
          zIndex: 1000,
        }}
        className="sticky-controls"
      >
        {/* Go Back Button */}
        <div>
          <button
            onClick={handleGoBack}
            className="btn btn-warning me-2"
            disabled={deleting}
          >
            ← My Recipes
          </button>
        </div>

        {/* Title */}
        <h1
          className={`${darkMode ? "text-deep-yellow" : "text-danger"}`}
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
            textAlign: "center",
            flex: 1,
          }}
        >
          {recipe.title}
        </h1>

        {/* Edit/Delete */}
        <div>
          <button
            onClick={handleEdit}
            className={`btn btn-warning text-dark me-2 ${deleting ? "disabled" : ""}`}
            disabled={deleting}
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>

      {/* Recipe Content */}
      {!loading && !error && recipe && (
        <UserRecipeDetails recipe={recipe} darkMode={darkMode} />
      )}
    </div>
  );
}
