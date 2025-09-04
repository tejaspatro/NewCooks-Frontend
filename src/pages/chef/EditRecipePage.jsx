import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosConfig";
import Swal from "sweetalert2";
import Uploader from "../../components/Uploader"; // Ensure you have the simplified Uploader.jsx from the previous answer

export default function EditRecipeDetailPage({ darkMode }) {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  // State for form text fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [utensils, setUtensils] = useState("");
  const [nutrition, setNutrition] = useState("");
  const [instructions, setInstructions] = useState("");

  // State for image URLs that are already saved on the backend
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  // State for NEW file objects selected by the user
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch initial recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosApi.get(`/chef/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const r = res.data;
        setTitle(r.title || "");
        setDescription(r.description || "");
        setIngredients((r.ingredients || []).join(", "));
        setUtensils((r.utensils || []).join(", "));
        setNutrition(r.nutritionInfo || "");
        setInstructions((r.instructions || []).join(", "));
        setThumbnailUrl(r.thumbnail || "");
        setImageUrls(r.images || []);
      } catch (err) {
        Swal.fire("Error", "Failed to load recipe details", "error");
        navigate("/chef/recipes"); // Navigate away if loading fails
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Confirm Update",
      text: "Are you sure you want to update this recipe?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    });

    if (!result.isConfirmed) {
      return;
    }

    Swal.fire({
      title: "Updating...",
      text: "Your recipe is being updated.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const formData = new FormData();

    const recipeData = {
      title,
      description,
      ingredients: ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      utensils: utensils.split(",").map((s) => s.trim()).filter(Boolean),
      nutritionInfo: nutrition,
      instructions: instructions.split(",").map((s) => s.trim()).filter(Boolean),
      thumbnail: thumbnailUrl,
      images: imageUrls,
    };

    formData.append("recipe", JSON.stringify(recipeData));

    if (newThumbnailFile) {
      formData.append("newThumbnailFile", newThumbnailFile);
    }
    newImageFiles.forEach(file => {
      formData.append("newImageFiles", file);
    });

    try {
      // In your handleUpdate function in EditRecipePage.jsx

      await axiosApi.put(
        `/chef/recipes/${recipeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // This line overrides the global default ONLY for this specific API call.
            // All other calls in your project remain unaffected.
            'Content-Type': undefined,
          }
        }
      );
      Swal.fire({
        icon: "success", title: "Recipe Updated", text: "Your recipe has been updated successfully!",
        timer: 1500, showConfirmButton: false,
      }).then(() => navigate(`/chef/recipes/${recipeId}`));

    } catch (err) {
      // This is the key fix for the SweetAlert2 error.
      // We extract a string from the error response object.
      const errorMessage = err.response?.data?.message || err.response?.data || "Update failed. Please try again.";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleCancel = () => {
      Swal.fire({
        title: "Are you sure?",
        text: "Your changes will not be saved if you cancel.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Discard Changes",
        cancelButtonText: "No, Stay Here"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(-1); // Go back to the previous page
        }
      });
    };

  if (loading) return <p>Loading recipe...</p>;

  // Combine existing URLs and new files for the Uploader component's preview
  const thumbnailForUploader = newThumbnailFile ? [newThumbnailFile] : (thumbnailUrl ? [thumbnailUrl] : []);
  const imagesForUploader = [...imageUrls, ...newImageFiles];

  return (
    <div className={`bg-main bg-dots page-content${darkMode ? " dark-mode" : ""}`} style={{ paddingTop: "2rem" }}>
      <h1 className={"text-deep-yellow"} style={{ fontSize: "2.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "1.5rem" }}>
        Edit Recipe
      </h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Ingredients (comma separated)</label>
          <input className="form-control" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Utensils (comma separated)</label>
          <input className="form-control" value={utensils} onChange={(e) => setUtensils(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Nutrition Info</label>
          <textarea className="form-control" rows="2" value={nutrition} onChange={(e) => setNutrition(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Instructions (comma separated)</label>
          <textarea className="form-control" rows="3" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </div>
        <hr />
        <div className="mb-3">
          <label className="form-label">Thumbnail Image</label>
          <Uploader
            maxFiles={1}
            files={thumbnailForUploader}
            onFilesChange={(newFiles) => {
              setThumbnailUrl(""); // Clear old URL when a new file is chosen
              setNewThumbnailFile(newFiles[newFiles.length - 1] || null);
            }}
            onRemove={() => {
              setThumbnailUrl("");
              setNewThumbnailFile(null);
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Additional Images</label>
          <Uploader
            maxFiles={5}
            files={imagesForUploader}
            onFilesChange={(allFiles) => {
              const newFiles = allFiles.filter(f => f instanceof File);
              setNewImageFiles(newFiles);
            }}
            onRemove={(fileToRemove) => {
              if (typeof fileToRemove === 'string') {
                setImageUrls(prev => prev.filter(url => url !== fileToRemove));
              } else {
                setNewImageFiles(prev => prev.filter(f => f !== fileToRemove));
              }
            }}
          />
          <div className="form-text text-secondary">You can upload up to <strong>5 images</strong>.</div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-warning">Update Recipe</button>
          <button type="button" className="btn btn-danger" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};