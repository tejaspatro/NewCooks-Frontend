import React, { useEffect, useRef, useState } from "react";
import { uploadImageToCloudinary } from "../utils/uploadImage";
import Swal from "sweetalert2";

const Uploader = ({
  maxFiles = 1,
  defaultFiles = [],
  onUploadStart,
  onUploadComplete,
  onUploadRemove,
  onDelete, // async(url) => Promise<boolean>
}) => {
  const [files, setFiles] = useState(defaultFiles);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Keep files in sync with parent prop
  useEffect(() => {
    setFiles(defaultFiles || []);
  }, [defaultFiles]);

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files || []);
    const remaining = maxFiles - files.length;
    if (remaining <= 0) {
      Swal.fire("Limit reached", `Maximum ${maxFiles} images allowed.`, "info");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const toUpload = selected.slice(0, remaining);
    setLoading(true);
    onUploadStart && onUploadStart();
    try {
      const uploadedUrls = await Promise.all(
        toUpload.map(async (file) => {
          const res = await uploadImageToCloudinary(file);
          return res.secure_url;
        })
      );
      const next = [...files, ...uploadedUrls];
      setFiles(next);
      onUploadComplete && onUploadComplete(next);
    } catch (err) {
      console.error(err);
      Swal.fire("Upload Error", "Some images failed to upload.", "error");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (index) => {
    const url = files[index];
    // Confirm backend deletion first (for already-uploaded images)
    if (onDelete) {
      try {
        const ok = await onDelete(url);
        if (!ok) return;
      } catch (e) {
        console.error(e);
        Swal.fire("Delete failed", "Could not delete this image right now.", "error");
        return;
      }
    }
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onUploadComplete && onUploadComplete(next);
    onUploadRemove && onUploadRemove(url);
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-warning mb-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={files.length >= maxFiles || loading}
      >
        {loading ? "Uploading..." : maxFiles > 1 ? "Choose Files" : "Choose File"}
      </button>
      <input
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        {files.map((url, i) => (
          <div key={url + i} style={{ position: "relative" }}>
            <img
              src={url}
              alt={`img-${i}`}
              width={100}
              height={100}
              style={{ objectFit: "cover", borderRadius: 6 }}
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: "#dc3545",
                color: "#fff",
              }}
              aria-label="Remove image"
              title="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {files.length >= maxFiles && (
        <p className="text-secondary mt-2">Maximum {maxFiles} files uploaded</p>
      )}
    </div>
  );
};

export default Uploader;
