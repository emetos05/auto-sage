"use client";

import { useState, useRef } from "react";

interface PhotoUploadProps {
  onPhotoCapture: (base64Image: string) => void;
  disabled?: boolean;
}

export default function PhotoUpload({
  onPhotoCapture,
  disabled = false,
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreview(base64);
      onPhotoCapture(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`cursor-pointer ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="text-5xl mb-2">📷</div>
            <p className="text-gray-600 font-medium">Take or upload a photo</p>
            <p className="text-sm text-gray-500 mt-1">
              Max 5MB • JPG, PNG, HEIC
            </p>
            <p className="text-xs text-orange-600 mt-2">
              ⚠️ Photos are analyzed locally and not stored
            </p>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium"
            type="button"
          >
            Remove
          </button>
          <p className="text-xs text-green-600 mt-2 text-center">
            ✓ Photo ready for analysis (not stored)
          </p>
        </div>
      )}
    </div>
  );
}
