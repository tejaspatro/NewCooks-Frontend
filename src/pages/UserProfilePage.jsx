import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosConfig";
import placeHolderImg from "../images/Profile_avatar_placeholder_large.png";
import Swal from "sweetalert2";
import { useLoading } from "../context/LoadingContext";
import { FaArrowLeft, FaUpload, FaTrash } from "react-icons/fa";
import "./chef/profile.css"

export default function UserProfilePage({ darkMode }) {
    const navigate = useNavigate();
    const { startLoading, stopLoading } = useLoading();
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [editable, setEditable] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const [newProfilePictureFile, setNewProfilePictureFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        async function fetchUser() {
            startLoading("Loading profile...");
            try {
                const response = await axiosApi.get("/user/userprofile");
                setUser(response.data);
                setUpdatedData(response.data);
            } catch (err) {
                setError("Failed to fetch your profile. Please login again!!!");
                console.error(err);
            } finally {
                stopLoading();
            }
        }
        fetchUser();
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
            const response = await axiosApi.put(`/user/userprofile`, formData, {
                headers: { "Content-Type": undefined },
            });
            setUser(response.data);
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
        setUpdatedData(user);
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
            <div className={`page-content${darkMode ? " dark-mode" : ""} bg-main text-center`}>
                {error}
            </div>
        );

    return (
        <div className={`profile-page ${darkMode ? "dark-mode" : ""}`}>
            <div className="profile-container">
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: "absolute",
                        top: 60,
                        left: 40,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        border: "none",
                        cursor: "pointer",
                        color: "#000",
                        fontSize: "1.2rem",
                        zIndex: 10,
                    }}
                    title="Go Back"
                >
                    <FaArrowLeft />
                </button>

                <div className="profile-image-wrapper" style={{ position: "relative" }}>
                    <img src={imageSource} alt="Profile" className="profile-image" />
                    {editable && (
                        <div>
                            {updatedData.profilePicture || newProfilePictureFile ? (
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
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            )}
                        </div>
                    )}
                </div>

                <div className="profile-details">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={updatedData.name || ""}
                        onChange={handleChange}
                        disabled={!editable || isSubmitting}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={updatedData.email || ""}
                        disabled
                    />

                    <label>About Me</label>
                    {editable ? (
                        <textarea
                            name="aboutMe"
                            value={updatedData.aboutMe || ""}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    ) : (
                        <textarea readOnly>
                            {updatedData.aboutMe || "No details added."}
                        </textarea>
                    )}

                    {!editable ? (
                        <div className="profile-actions justify-content-center d-flex align-items-center">
                            <button
                                className="btn btn-warning"
                                onClick={() => setEditable(true)}
                            >
                                Update Profile
                            </button>
                        </div>
                    ) : (
                        <div className="profile-actions">
                            <button
                                className="btn btn-warning"
                                onClick={handleSave}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleCancel}
                                disabled={isSubmitting}
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
