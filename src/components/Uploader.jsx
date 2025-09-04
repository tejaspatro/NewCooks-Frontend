import React, { useRef } from "react";

const Uploader = ({
  maxFiles = 1,
  files = [], // This will now contain a mix of existing URL strings and new File objects
  onFilesChange, // Callback to notify parent of changes
  onRemove, // Callback to notify parent of a removed file/URL
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const remainingSlots = maxFiles - files.length;
    if (remainingSlots <= 0) return;

    const newFiles = selected.slice(0, remainingSlots);
    onFilesChange([...files, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (indexToRemove) => {
    const fileToRemove = files[indexToRemove];
    onRemove(fileToRemove, indexToRemove); // Notify parent
  };

  const getFileUrl = (file) => {
    if (typeof file === "string") {
      return file; // It's an existing URL
    }
    return URL.createObjectURL(file); // It's a new File object, create a temporary preview URL
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-warning mb-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={files.length >= maxFiles}
      >
        {maxFiles > 1 ? "Choose Files" : "Choose File"}
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
        {files.map((file, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img
              src={getFileUrl(file)}
              alt={`preview-${i}`}
              width={100}
              height={100}
              style={{ objectFit: "cover", borderRadius: 6 }}
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              style={{
                position: "absolute", top: -6, right: -6, width: 22, height: 22,
                borderRadius: "50%", border: "none", cursor: "pointer",
                background: "#dc3545", color: "#fff",
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