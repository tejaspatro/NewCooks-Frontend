import React, { useState, useRef } from "react";
import { uploadImageToCloudinary, removeImageFromCloudinary } from "../utils/uploadImage";
import Swal from "sweetalert2";

const Uploader = ({ maxFiles = 1, defaultFiles = [], onUploadComplete }) => {
  const [files, setFiles] = useState(defaultFiles); // stores uploaded URLs
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle selecting new files
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const remainingSlots = maxFiles - files.length;

    if (remainingSlots <= 0) {
      Swal.fire("Error", `You can upload maximum ${maxFiles} files.`, "error");
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
      return;
    }

    const allowedFiles = selectedFiles.slice(0, remainingSlots);

    setLoading(true);
    let uploadedUrls = [];

    try {
      uploadedUrls = await Promise.all(
        allowedFiles.map(async (file) => {
          const data = await uploadImageToCloudinary(file);
          return data.secure_url;
        })
      );
    } catch (err) {
      console.error("Upload failed:", err);
      Swal.fire("Upload Error", "Failed to upload some images.", "error");
    }

    const newFiles = [...files, ...uploadedUrls];
    setFiles(newFiles);
    onUploadComplete && onUploadComplete(newFiles);
    setLoading(false);

    if (fileInputRef.current) fileInputRef.current.value = ""; // clear "No file chosen"
  };

  // Handle removing uploaded files
  const handleRemove = async (index) => {
    const urlToRemove = files[index];
    try {
      const urlObj = new URL(urlToRemove);
      const pathParts = urlObj.pathname.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const publicId = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;

      await removeImageFromCloudinary(publicId);
    } catch (err) {
      console.warn("Could not remove from cloud, removing locally only.");
    }

    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUploadComplete && onUploadComplete(newFiles);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      {/* Custom button instead of default file input */}
      <button
        type="button"
        className="btn btn-warning mb-2"
        onClick={() => fileInputRef.current.click()}
      >
        {maxFiles > 1 ? "Choose Files" : "Choose File"}
      </button>

      {/* Hidden input */}
      <input
        type="file"
        multiple={maxFiles > 1}
        onChange={handleFileChange}
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
      />

      {loading && <p>Uploading...</p>}

      {/* Preview images */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
        {files.map((url, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img
              src={url}
              alt={`upload-${i}`}
              width={100}
              height={100}
              style={{ objectFit: "cover", borderRadius: "6px" }}
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                width: 20,
                height: 20,
                fontSize: 12,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Info when max reached */}
      {files.length >= maxFiles && (
        <p style={{ color: "gray", marginTop: "5px" }}>
          Maximum {maxFiles} files uploaded
        </p>
      )}
    </div>
  );
};

export default Uploader;
