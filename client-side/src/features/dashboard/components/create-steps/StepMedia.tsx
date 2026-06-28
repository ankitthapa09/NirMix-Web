"use client";

import { useRef } from "react";
import { Upload, X, Film, FileText } from "lucide-react";
import { MediaItem, PropertyFormData, StepProps } from "./types";

type StepMediaProps = StepProps;

export function StepMedia({ formData, onChange, errors }: StepMediaProps) {
  const { photos = [], videoLink = "", floorPlan = null } = formData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (fields: Partial<PropertyFormData>) => {
    onChange({ ...formData, ...fields });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos = [...photos];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      newPhotos.push({
        url: previewUrl,
        file: file,
        name: file.name,
      });
    }

    handleUpdate({ photos: newPhotos });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    // Revoke the object URL to avoid memory leaks
    if (newPhotos[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(newPhotos[index].url);
    }
    newPhotos.splice(index, 1);
    handleUpdate({ photos: newPhotos });
  };

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const previewUrl = URL.createObjectURL(file);
    handleUpdate({
      floorPlan: {
        url: previewUrl,
        file: file,
        name: file.name,
      },
    });
  };

  const removeFloorPlan = () => {
    if (floorPlan && floorPlan.url.startsWith("blob:")) {
      URL.revokeObjectURL(floorPlan.url);
    }
    handleUpdate({ floorPlan: null });
    if (floorPlanInputRef.current) floorPlanInputRef.current.value = "";
  };

  const triggerPhotoSelect = () => {
    fileInputRef.current?.click();
  };

  const triggerFloorPlanSelect = () => {
    floorPlanInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Photo Uploader */}
      <div>
        <label className="nm-label">Upload Property Photos</label>

        {/* Drop zone / main trigger */}
        {photos.length === 0 ? (
          <div
            onClick={triggerPhotoSelect}
            className="nm-recessed w-full h-56 flex flex-col items-center justify-center cursor-pointer group"
          >
            <div
              className="p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: "var(--nm-accent-soft)", color: "var(--nm-accent)" }}
            >
              <Upload className="h-6 w-6" />
            </div>
            <span className="text-sm font-bold text-[#342417]">
              Drag & Drop files or Click to Browse
            </span>
            <span className="text-xs text-[#342417]/55 mt-1">
              Supports JPEG, PNG up to 10MB each. Upload at least 3 photos for best engagement.
            </span>
          </div>
        ) : (
          /* Grid of uploaded images */
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {photos.map((photo: MediaItem, index: number) => (
              <div
                key={index}
                className="relative aspect-video rounded-xl overflow-hidden border border-[#E0D4C5] bg-white group shadow-sm"
              >
                <img
                  src={photo.url}
                  alt={`Property preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Cover badge for first image */}
                {index === 0 && (
                  <span
                    className="absolute top-2 left-2 px-2.5 py-1 text-[9px] font-extrabold uppercase text-[#342417] rounded-md tracking-wider shadow-sm z-10"
                    style={{ backgroundColor: "var(--nm-accent)" }}
                  >
                    Cover
                  </span>
                )}

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* Plus Card to add more */}
            <button
              type="button"
              onClick={triggerPhotoSelect}
              className="nm-tile flex flex-col items-center justify-center aspect-video cursor-pointer"
            >
              <Upload className="h-5 w-5 text-[#342417]/60 mb-1" />
              <span className="text-xs font-bold text-[#342417]/70">Add More</span>
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        {errors.photos && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.photos}</p>
        )}
      </div>

      {/* Video Tour Link */}
      <div>
        <label htmlFor="video-link" className="nm-label flex items-center gap-1.5">
          <Film className="h-4 w-4 text-[#342417]/70" />
          Video Tour Link (YouTube or Vimeo)
        </label>
        <input
          id="video-link"
          type="url"
          value={videoLink}
          onChange={(e) => handleUpdate({ videoLink: e.target.value })}
          placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          className="nm-input px-4 py-3 text-xs font-semibold"
        />
      </div>

      {/* Floor Plan */}
      <div>
        <label className="nm-label flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-[#342417]/70" />
          Floor Plan (Optional)
        </label>

        {floorPlan ? (
          <div className="nm-panel flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{ backgroundColor: "var(--nm-accent-soft)", color: "var(--nm-accent)" }}
              >
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#342417] truncate max-w-xs sm:max-w-md">
                  {floorPlan.name}
                </p>
                <p className="text-[10px] text-[#342417]/50 mt-0.5">Floor plan attached</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFloorPlan}
              className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
              aria-label="Remove floor plan"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={triggerFloorPlanSelect}
            className="nm-tile flex items-center gap-3 p-4 cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-[#EBDDC0] text-[#342417]/60">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#342417]">
                Upload floor plan image or PDF
              </p>
              <p className="text-[10px] text-[#342417]/40 mt-0.5">
                PDF, JPG or PNG up to 5MB.
              </p>
            </div>
          </div>
        )}

        <input
          ref={floorPlanInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFloorPlanUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
