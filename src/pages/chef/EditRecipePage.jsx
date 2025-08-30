import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosConfig";
import Swal from "sweetalert2";
import Uploader from "../../components/Uploader";

const EditRecipeDetailPage = () => {
  const { chefId, recipeId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [utensils, setUtensils] = useState("");
  const [nutrition, setNutrition] = useState("");
  const [instructions, setInstructions] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosApi.get(`/chef/${chefId}/recipes/${recipeId}`);
        const r = res.data;
        setTitle(r.title || "");
        setDescription(r.description || "");
        setIngredients((r.ingredients || []).join(", "));
        setUtensils((r.utensils || []).join(", "));
        setNutrition(r.nutritionInfo || "");
        setInstructions((r.instructions || []).join(", "));
        setThumbnail(r.thumbnail || "");
        setImages(r.images || []);
      } catch (err) {
        Swal.fire("Error", "Failed to load recipe details", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [chefId, recipeId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (uploading) {
      Swal.fire("Wait", "Please wait until image upload completes.", "info");
      return;
    }
    try {
      await axiosApi.put(
        `/chef/${chefId}/recipes/${recipeId}`,
        {
          title,
          description,
          ingredients: ingredients.split(",").map((s) => s.trim()).filter(Boolean),
          utensils: utensils.split(",").map((s) => s.trim()).filter(Boolean),
          nutritionInfo: nutrition,
          instructions: instructions.split(",").map((s) => s.trim()).filter(Boolean),
          thumbnail,
          images,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Recipe Updated",
        text: "Your recipe has been updated successfully!",
        timer: 1400,
        showConfirmButton: false,
      }).then(() => navigate(`/chef/${chefId}/recipes/${recipeId}`));
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    }
  };

  // shared delete caller for uploader(s)
  const deleteUrlForThisRecipe = async (url) => {
    try {
      await axiosApi.post(
        `/chef/${chefId}/recipes/${recipeId}/images/delete`,
        { url },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return true;
    } catch (err) {
      Swal.fire("Delete failed", err.response?.data || "Unable to delete image", "error");
      return false;
    }
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div className="container mt-4">
      <h2>Edit Recipe</h2>
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
        <div className="mb-3">
          <label className="form-label">Thumbnail Image</label>
          <Uploader
            maxFiles={1}
            defaultFiles={thumbnail ? [thumbnail] : []}
            onUploadStart={() => {
              setUploading(true);
              Swal.fire({ title: "Uploading...", text: "Your image is uploading.", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            }}
            onUploadComplete={(urls) => {
              setThumbnail(urls[0] || "");
              setUploading(false);
              Swal.close();
              if (urls.length) Swal.fire("Uploaded!", "Thumbnail uploaded successfully.", "success");
            }}
            onUploadRemove={() => setThumbnail("")}
            onDelete={deleteUrlForThisRecipe}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Additional Images</label>
          <Uploader
            maxFiles={5}
            defaultFiles={images}
            onUploadStart={() => setUploading(true)}
            onUploadComplete={(urls) => {
              setImages(urls);
              setUploading(false);
            }}
            onUploadRemove={(removedUrl) => {
              setImages((prev) => prev.filter((u) => u !== removedUrl));
            }}
            onDelete={deleteUrlForThisRecipe}
          />
          <div className="form-text text-secondary">You can upload up to <strong>5 images</strong>.</div>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <button type="submit" className="btn btn-warning" disabled={uploading}>Update</button>
          <button type="button" className="btn btn-danger" disabled={uploading} onClick={() => navigate(`/chef/${chefId}/recipes/${recipeId}`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipeDetailPage;
