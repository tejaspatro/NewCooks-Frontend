import { useState, useEffect } from "react";
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
    const [loading, setLoading] = useState(true);
    const [thumbnail, setThumbnail] = useState("");
    const [images, setImages] = useState([]);


    // Fetch recipe details on mount
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await axiosApi.get(`/chef/${chefId}/recipes/${recipeId}`);
                setTitle(res.data.title);
                setDescription(res.data.description);
                setIngredients(res.data.ingredients?.join(", ") || "");
                setUtensils(res.data.utensils?.join(", ") || "");
                setNutrition(res.data.nutritionInfo || "");
                setInstructions(res.data.instructions?.join(", ") || "");
                setThumbnail(res.data.thumbnail || "");
                setImages(res.data.images || []);
            } catch (err) {
                Swal.fire("Error", "Failed to load recipe details", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [chefId, recipeId]);

    // Handle form submit
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosApi.put(
                `/chef/${chefId}/recipes/${recipeId}`,
                {
                    title,
                    description,
                    ingredients: ingredients.split(",").map((i) => i.trim()),
                    utensils: utensils.split(",").map((u) => u.trim()),
                    nutrition,
                    instructions: instructions.split(",").map((s) => s.trim()),
                    thumbnail,
                    images,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title: "Recipe Updated",
                text: "Your recipe has been updated successfully!",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => navigate(`/chef/${chefId}/recipes/${recipeId}`), { replace: true });
        } catch (err) {
            Swal.fire(
                "Error",
                err.response?.data?.message || "Update failed",
                "error"
            );
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            
            <h2>Edit Recipe</h2>
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ingredients (comma separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Utensils (comma separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={utensils}
                        onChange={(e) => setUtensils(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nutrition Info</label>
                    <textarea
                        className="form-control"
                        rows="2"
                        value={nutrition}
                        onChange={(e) => setNutrition(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Instructions (comma separated)</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Thumbnail Image</label>
                    <Uploader maxFiles={1} defaultFiles={thumbnail ? [thumbnail] : []} onUploadComplete={(urls) => setThumbnail(urls[0] || "")} />
                </div>

                <div className="mb-3">
  <label className="form-label">Additional Images</label>
  <Uploader maxFiles={5} defaultFiles={images} onUploadComplete={setImages} />
  <div className="form-text text-secondary">
    You can upload up to <strong>5 images</strong>.
  </div>
</div>


                <div className="d-flex justify-content-between mt-3">
                    <button type="submit" className="btn btn-warning">
                        Update
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => navigate(`/chef/${chefId}/recipes/${recipeId}`)}
                    >
                        Cancel
                    </button>

                </div>

            </form>
        </div>
    );
};

export default EditRecipeDetailPage;
