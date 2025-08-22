import axios from "axios";

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "newcooks_recipes"); // replace with your preset
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dhszmrsis/image/upload",
    formData
  );
  return res.data;
};

export const removeImageFromCloudinary = async (chefId, recipeId, url) => {
  await axios.post(`/chef/${chefId}/recipes/${recipeId}/images/delete`, { url });
};

