import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosConfig";
import "../recipe.css";
import "./profile.css";
import placeHolderImg from "../../images/Profile_avatar_placeholder_large.png";
import { FaUpload, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useLoading } from "../../context/LoadingContext";

export default function ChefProfilePage({ darkMode }) {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [error, setError] = useState(null);
  const [chef, setChef] = useState(null);
  const [editable, setEditable] = useState(false);
  // Removed separate loading state since using context loading
  // const [loading, setLoading] = useState(true);
  const [updatedData, setUpdatedData] = useState({});
  const [newProfilePictureFile, setNewProfilePictureFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchChef() {
      startLoading("Loading profile...");
      try {
        const response = await axiosApi.get("/chef/chefprofile");
        setChef(response.data);
        setUpdatedData(response.data);
      } catch (err) {
        setError("Failed to fetch your profile. Please login again!!!")
        console.error(err);
      } finally {
        stopLoading();
      }
    }
    fetchChef();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("profile", JSON.stringify(updatedData));

    if (newProfilePictureFile) {
      formData.append("profilePictureFile", newProfilePictureFile);
    }

    try {
      const response = await axiosApi.put(`/chef/chefprofile`, formData, {
        headers: { "Content-Type": undefined },
      });
      setChef(response.data);
      setUpdatedData(response.data);
      setNewProfilePictureFile(null);
      setEditable(false);
      Swal.fire("Success", "Profile updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setUpdatedData(chef);
    setNewProfilePictureFile(null);
    setEditable(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewProfilePictureFile(file);
    setUpdatedData({ ...updatedData, profilePicture: null });
  };

  const handleImageDelete = () => {
    setUpdatedData({ ...updatedData, profilePicture: null });
    setNewProfilePictureFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  let imageSource = updatedData.profilePicture || placeHolderImg;
  if (newProfilePictureFile) {
    imageSource = URL.createObjectURL(newProfilePictureFile);
  }

  if (error)
    return (
      <div
        className={`page-content${darkMode ? " dark-mode" : ""} bg-main text-center`}
      >
        {error}
      </div>
    );

    return (
        <div className={`profile-page ${darkMode ? "dark-mode" : ""}`}>
            <div className="profile-container">
                <div className="profile-image-wrapper">
                    <img src={imageSource} alt="Profile" className="profile-image" />
                    {editable && (
                        <div>
                            {/* UPDATED: Check both states for delete icon */}
                            {updatedData.profilePicture || newProfilePictureFile ? (
                                <button className="image-action-btn" onClick={handleImageDelete} title="Delete Image">
                                    <FaTrash />
                                </button>
                            ) : (
                                <label className="image-action-btn" title="Upload Image">
                                    <FaUpload />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        ref={fileInputRef}
                                        onChange={handleFileSelect} // Use new handler
                                    />
                                </label>
                            )}
                        </div>
                    )}
                </div>

                <div className="profile-details">
                    <label>Name</label>
                    <input type="text" name="name" value={updatedData.name || ""} onChange={handleChange} disabled={!editable || isSubmitting} />
                    <label>Expertise</label>
                    <input type="text" name="expertise" value={updatedData.expertise || ""} onChange={handleChange} disabled={!editable || isSubmitting} />
                    <label>Experience</label>
                    <input type="text" name="experience" value={updatedData.experience || ""} onChange={handleChange} disabled={!editable || isSubmitting} />
                    <label>Bio</label>
                    <textarea name="bio" value={updatedData.bio || ""} onChange={handleChange} disabled={!editable || isSubmitting} />

                    {!editable ? (
                        <div className="profile-actions justify-content-center d-flex align-items-center">
                        <button className="btn btn-warning " onClick={() => setEditable(true)}>
                            Edit Profile
                        </button>
                        </div>
                    ) : (
                        <div className="profile-actions">
                            <button className="btn btn-warning" onClick={handleSave} disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                            <button className="btn btn-danger" onClick={handleCancel} disabled={isSubmitting}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}