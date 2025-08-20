import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosConfig";
import Swal from "sweetalert2";

export default function ChefRecipeDetailPage({ darkMode }) {
  const { chefId, recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    }
  }
};

  if (loading) return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>Loading...</div>;
  if (error) return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>{error}</div>;
  if (!recipe) return <div className={`page-content${darkMode ? " dark-mode" : ""}`}>Recipe not found</div>;

  return (
    <div className={`page-content${darkMode ? " dark-mode" : ""}`} style={{ position: "relative", paddingBottom: "2rem" }}>
      {/* Edit/Delete buttons */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <Link
          to={`/chef/${chefId}/recipes/${recipeId}/edit`}
          className="btn btn-primary me-2"
        >
          Edit
        </Link>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>

      {/* Recipe image */}
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover", marginBottom: "1rem" }}
        />
      )}

      {/* Details */}
      <h1>{recipe.title}</h1>
      <p><strong>Description:</strong> {recipe.description}</p>

      <section>
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients?.map((ing, idx) => <li key={idx}>{ing}</li>)}
        </ul>
      </section>

      <section>
        <h3>Utensils</h3>
        <ul>
          {recipe.utensils?.map((ut, idx) => <li key={idx}>{ut}</li>)}
        </ul>
      </section>

      <section>
        <h3>Nutrition Information</h3>
        <p>{recipe.nutritionInfo}</p>
      </section>

      <section>
        <h3>Instructions</h3>
        <ol>
          {recipe.instructions?.map((step, idx) => <li key={idx}>{step}</li>)}
        </ol>
      </section>

      {/* Placeholder for rating summary */}
      <div style={{ marginTop: "1rem" }}>
        <strong>Rating:</strong> ⭐⭐⭐⭐⭐ (N ratings)
      </div>
    </div>
  );
}
