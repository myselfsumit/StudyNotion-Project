import React, { useState, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { Player } from "video-react";
import "video-react/dist/video-react.css";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [previewSource, setPreviewSource] = useState(viewData || editData || "");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSource(reader.result);
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const resetFile = () => {
    setPreviewSource("");
    setSelectedFile(null);
    setValue(name, null);
  };

  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, name, setValue]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div className="flex min-h-[250px] items-center justify-center rounded-md border-2 border-dotted border-richblack-500 bg-richblack-700">
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={resetFile}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-center text-sm"
            >
              <FiUploadCloud className="text-3xl text-yellow-50" />
              <p className="mt-2">
                Drag and drop a {!video ? "image" : "video"} or{" "}
                <span className="font-semibold text-yellow-50">browse</span>
              </p>
              <input
                id="file-upload"
                type="file"
                accept={video ? "video/*" : "image/*"}
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <ul className="mt-2 text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="text-xs text-pink-200">{label} is required</span>
      )}
    </div>
  );
}
