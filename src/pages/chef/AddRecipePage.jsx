import React, { useState } from "react";
import axiosApi from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Uploader from "../../components/Uploader";

export default function AddRecipePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [utensils, setUtensils] = useState("");
  const [nutritionInfo, setNutritionInfo] = useState("");
  const [instructions, setInstructions] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState([]);
  const chefId = localStorage.getItem("chefId");

  const navigate = useNavigate();

  const handleListChange = (setter) => (e) => setter(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation (top → bottom)
    if (!title.trim()) {
      Swal.fire("Title Error", "Please enter a recipe title.", "error");
      return;
    }
    if (!description.trim()) {
      Swal.fire("Description Error", "Please enter a description.", "error");
      return;
    }
    if (!ingredients.trim() || ingredients.includes(".")) {
      Swal.fire("Ingredients Error", "Please separate ingredients with commas, not periods(.)", "error");
      return;
    }
    if (!utensils.trim() || utensils.includes(".")) {
      Swal.fire("Utensils Error", "Please separate utensils with commas, not periods(.)", "error");
      return;
    }
    if (!instructions.trim() || instructions.includes(".")) {
      Swal.fire("Instructions Error", "Please separate instructions with commas, not periods(.)", "error");
      return;
    }
    if (!thumbnail) {
      Swal.fire("Thumbnail Error", "Please upload a thumbnail image.", "error");
      return;
    }

    const payload = {
      title,
      description,
      ingredients: ingredients.split(",").map(i => i.trim()).filter(Boolean),
      utensils: utensils.split(",").map(u => u.trim()).filter(Boolean),
      nutritionInfo,
      instructions: instructions.split(",").map(inst => inst.trim()).filter(Boolean),
      thumbnail,
      images
    };

    try {
      await axiosApi.post(`/chef/${chefId}/recipes`, payload);

      Swal.fire({
        icon: "success",
        title: "Recipe saved!",
        text: "Your recipe has been added successfully.",
        confirmButtonText: "OK"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(chefId ? `/chef/${chefId}/recipes` : "/dashboard");
        }
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || "Something went wrong while saving the recipe.";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Ingredients (comma separated)</label>
          <textarea className="form-control" value={ingredients} onChange={handleListChange(setIngredients)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Utensils (comma separated)</label>
          <textarea className="form-control" value={utensils} onChange={handleListChange(setUtensils)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Nutrition Info</label>
          <input className="form-control" value={nutritionInfo} onChange={(e) => setNutritionInfo(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Instructions (comma separated)</label>
          <textarea className="form-control" value={instructions} onChange={handleListChange(setInstructions)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Thumbnail Image</label>
          <Uploader maxFiles={1} onUploadComplete={(urls) => setThumbnail(urls[0] || "")} />
        </div>

        <div className="mb-3">
          <label className="form-label">Additional Images</label>
          <Uploader maxFiles={5} onUploadComplete={setImages} />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-warning">Save Recipe</button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "Your changes will not be saved if you cancel.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, stay here"
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate(`/chef/${chefId}/recipes`);
                }
              });
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
