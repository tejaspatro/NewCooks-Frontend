import React, { useState } from "react";
import axiosApi from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Uploader from "../../components/Uploader"; // Using the simplified Uploader component
import { FaPlus, FaMinus } from "react-icons/fa";

export default function AddRecipePage({darkMode}) {
  // State for text fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [utensils, setUtensils] = useState("");
  const [nutritionInfo, setNutritionInfo] = useState("");
  const [instructions, setInstructions] = useState([""]);

  // State to hold the raw File objects
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  
  // State to manage submission status and disable buttons
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // CHANGED: New functions to handle dynamic instructions
  const handleAddInstruction = (index) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index + 1, 0, "");
    setInstructions(newInstructions);
  };

  const handleRemoveInstruction = (index) => {
    if (instructions.length > 1) {
      const newInstructions = instructions.filter((_, i) => i !== index);
      setInstructions(newInstructions);
    }
  };

  const handleChangeInstruction = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable buttons on submission start

    const filteredInstructions = instructions.filter(i => i.trim() !== "");
    // --- MERGED: Detailed validation from the old file ---
    if (!title.trim()) {
      Swal.fire("Title Error", "Please enter a recipe title.", "error");
      setIsSubmitting(false);
      return;
    }
    if (!description.trim()) {
      Swal.fire("Description Error", "Please enter a description.", "error");
      setIsSubmitting(false);
      return;
    }
    if (!ingredients.trim()) {
      Swal.fire("Error", "Please enter the ingredients.", "error");
      setIsSubmitting(false);
      return;
    }
    if (ingredients.includes(".")) {
      Swal.fire("Ingredients Error", "Please separate ingredients with commas, not periods(.)", "error");
      setIsSubmitting(false);
      return;
    }
    if (!utensils.trim()) {
      Swal.fire("Error", "Please enter the utensils.", "error");
      setIsSubmitting(false);
      return;
    }
    if (utensils.includes(".")) {
      Swal.fire("Utensils Error", "Please separate utensils with commas, not periods(.)", "error");
      setIsSubmitting(false);
      return;
    }
     if (filteredInstructions.length === 0) {
      Swal.fire("Instructions Error", "Please enter at least one instruction.", "error");
      setIsSubmitting(false);
      return;
    }
    // --- End of merged validation ---

    Swal.fire({ 
        title: "Saving...", 
        text: "Your new recipe is being saved.", 
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
    });

    const formData = new FormData();

    const recipeData = {
      title,
      description,
      ingredients: ingredients.split(",").map(i => i.trim()).filter(Boolean),
      utensils: utensils.split(",").map(u => u.trim()).filter(Boolean),
      nutritionInfo,
      instructions: filteredInstructions,
    };
    formData.append("recipe", JSON.stringify(recipeData));

    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }
    imageFiles.forEach(file => {
      formData.append("imageFiles", file);
    });

    try {
      await axiosApi.post(`/chef/recipes`, formData, {
        headers: {
          'Content-Type': undefined, 
        },
      });

      Swal.fire({
        icon: "success",
        title: "Recipe Saved!",
        text: "Your new recipe has been added successfully.",
      }).then(() => {
        navigate(`/chef/recipes`);
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Something went wrong while saving the recipe.";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSubmitting(false); // Re-enable buttons after submission attempt
    }
  };

  // --- MERGED: Cancel confirmation dialog from the old file ---
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

  return (
        <div className={`bg-main bg-dots page-content${darkMode ? " dark-mode" : ""}`} style={{ paddingTop: "2rem" }}>
      <h2 className={"text-deep-yellow text-center"}>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}  rows="3" />
        </div>
        <div className="mb-3">
          <label className="form-label">Ingredients (comma separated)</label>
          <textarea className="form-control" value={ingredients} onChange={(e) => setIngredients(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Utensils (comma separated)</label>
          <textarea className="form-control" value={utensils} onChange={(e) => setUtensils(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Nutrition Info</label>
          <input className="form-control" value={nutritionInfo} onChange={(e) => setNutritionInfo(e.target.value)} />
        </div>
        {/* CHANGED: Dynamic instructions input fields */}
        <div className="mb-3">
          <label className="form-label">Instructions</label>
          {instructions.map((instruction, index) => (
            <div key={index} className="input-group mb-2 instruction-row">
              <span className="input-group-text step-number">{index + 1}</span>
              <textarea
                className="form-control"
                rows="1"
                value={instruction}
                onChange={(e) => handleChangeInstruction(index, e.target.value)}
                placeholder="Enter instruction"
              />
              <button
                className="btn btn-outline-secondary plus-btn"
                type="button"
                onClick={() => handleAddInstruction(index)}
                title="Add instruction"
              >
                <FaPlus className="icon-plus" />
              </button>
              {instructions.length > 1 && (
                <button
                  className="btn btn-outline-danger minus-btn"
                  type="button"
                  onClick={() => handleRemoveInstruction(index)}
                  title="Remove instruction"
                >
                  <FaMinus className="icon-minus" />
                </button>
              )}
            </div>
          ))}
        </div>
        <hr/>
        <div className="mb-3">
          <label className="form-label">Thumbnail Image</label>
          <Uploader
            maxFiles={1}
            files={thumbnailFile ? [thumbnailFile] : []}
            onFilesChange={(files) => setThumbnailFile(files[0] || null)}
            onRemove={() => setThumbnailFile(null)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Additional Images</label>
          <Uploader
            maxFiles={5}
            files={imageFiles}
            onFilesChange={(files) => setImageFiles(files)}
            onRemove={(fileToRemove) => {
              setImageFiles(prev => prev.filter(f => f !== fileToRemove));
            }}
          />
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-warning" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Recipe"}
          </button>
          <button type="button" className="btn btn-danger" disabled={isSubmitting} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}