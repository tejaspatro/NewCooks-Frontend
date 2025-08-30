import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosConfig";
import "../recipe.css";
import "./profile.css";
import placeHolderImg from "../../images/Profile_avatar_placeholder_large.png";
import { FaUpload, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

export default function ChefProfilePage({ darkMode }) {
    const navigate = useNavigate();
    const [chef, setChef] = useState(null);
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updatedData, setUpdatedData] = useState({});
    const [isUploading, setIsUploading] = useState(false); // uploading state

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        async function fetchChef() {
            try {
                setLoading(true);
                const response = await axiosApi.get("/chef/chefprofile");
                setChef(response.data);
                setUpdatedData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchChef();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({ ...updatedData, [name]: value });
    };

    const handleSave = async () => {
        try {
            if (isUploading) {
                Swal.fire("Please wait", "Image is still uploading!", "info");
                return;
            }

            const response = await axiosApi.put(`/chef/chefprofile`, updatedData);
            setChef(response.data);
            setEditable(false);
            Swal.fire("Success", "Profile updated successfully!", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to update profile", "error");
        }
    };

    const handleCancel = () => {
        setUpdatedData(chef);
        setEditable(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        Swal.fire({
            title: "Uploading...",
            text: "Please wait while your image is being uploaded",
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false
        });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );
            setUpdatedData({ ...updatedData, profilePicture: res.data.secure_url });
            Swal.close();
            Swal.fire("Uploaded!", "Profile image uploaded successfully.", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to upload image", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageDelete = () => {
        setUpdatedData({ ...updatedData, profilePicture: null });
    };

    if (loading) return <div>Loading...</div>;
    if (!chef) return <div>No profile found</div>;

    return (
        <div className={`profile-page ${darkMode ? "dark-mode" : ""}`}>
            <div className="profile-container">
                {/* Profile Image */}
                <div className="profile-image-wrapper">
                    <img
                        src={updatedData.profilePicture || placeHolderImg}
                        alt="Profile"
                        className="profile-image"
                    />
                    {editable && (
                        <div>
                            {updatedData.profilePicture ? (
                                <button
                                    className="image-action-btn"
                                    onClick={handleImageDelete}
                                    title="Delete Image"
                                >
                                    <FaTrash />
                                </button>
                            ) : (
                                <label className="image-action-btn" title="Upload Image">
                                    <FaUpload />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="profile-details">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={updatedData.name}
                        onChange={handleChange}
                        disabled={!editable || isUploading}
                    />

                    <label>Expertise</label>
                    <input
                        type="text"
                        name="expertise"
                        value={updatedData.expertise || ""}
                        onChange={handleChange}
                        disabled={!editable || isUploading}
                    />

                    <label>Experience</label>
                    <input
                        type="text"
                        name="experience"
                        value={updatedData.experience || ""}
                        onChange={handleChange}
                        disabled={!editable || isUploading}
                    />

                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={updatedData.bio || ""}
                        onChange={handleChange}
                        disabled={!editable || isUploading}
                    />

                    {/* Action Buttons */}
                    {!editable ? (
                        <button className="btn btn-warning" onClick={() => setEditable(true)}>
                            Update Profile
                        </button>
                    ) : (
                        <div className="profile-actions">
                            <button
                                className="btn btn-success"
                                onClick={handleSave}
                                disabled={isUploading} // disable while uploading
                            >
                                Save
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleCancel}
                                disabled={isUploading} // disable while uploading
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
