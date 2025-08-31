import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosConfig";
import Swal from "sweetalert2";
import RecipeDetails from "../../components/RecipeDetails";

export default function ChefRecipeDetailPage({ darkMode }) {
  const { chefId, recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);
        const res = await axiosApi.get(`/chef/${chefId}/recipes/${recipeId}`);
        setRecipe(res.data);
      } catch (err) {
        setError("Failed to load recipe.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [chefId, recipeId]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this recipe?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        setDeleting(true);
        await axiosApi.delete(`/chef/${chefId}/recipes/${recipeId}`);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your recipe has been deleted.",
          confirmButtonText: "OK"
        }).then(() => {
          navigate(`/chef/${chefId}/recipes`);
        });

      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: "Something went wrong while deleting the recipe."
        });
        console.error(err);
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>Loading...</div>;
  if (error) return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>{error}</div>;
  if (!recipe) return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>Recipe not found</div>;

  return (
    <div className={`bg-main bg-dots page-content${darkMode ? " dark-mode" : ""}`} style={{ position: "relative", paddingBottom: "2rem" }}>

      {/* Top Controls: Go Back / Edit / Delete */}
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
        <div style={{ left: 0 }}>
          <button
            onClick={() => navigate(`/chef/${chefId}/recipes`)}
            className="btn btn-warning me-2"
            disabled={deleting}
          >
            ← Go Back
          </button>
        </div>

        {/* Centered Title */}
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

        {/* Edit/Delete Buttons */}
        <div>
          <Link
            to={`/chef/${chefId}/recipes/${recipeId}/edit`}
            className={`btn btn-warning text-dark me-2 ${deleting ? "disabled" : ""}`}
            onClick={(e) => deleting && e.preventDefault()}
          >
            Edit
          </Link>

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

      {!loading && !error && recipe && (
        <RecipeDetails recipe={recipe} darkMode={darkMode} />
      )}

    </div>
  );
}
