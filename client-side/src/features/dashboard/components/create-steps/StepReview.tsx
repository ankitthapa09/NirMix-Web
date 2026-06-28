"use client";

import { Check } from "lucide-react";
import { PropertyFormData } from "./types";

interface StepReviewProps {
  formData: PropertyFormData;
  onGoToStep: (stepIndex: number) => void;
  errors: Record<string, string>;
  onCheckboxChange: (checked: boolean) => void;
}

export function StepReview({ formData, onGoToStep, errors, onCheckboxChange }: StepReviewProps) {
  const {
    listingType,
    propertyType,
    title,
    district,
    city,
    area,
    price,
    negotiable,
    ownership,
    beds,
    baths,
    balconies,
    floor,
    builtUpArea,
    carpetArea,
    photos = [],
    videoLink = "",
    termsAccepted = false,
  } = formData;

  const renderDetailsList = () => {
    switch (propertyType) {
      case "Land":
        const landParts = [];
        if (formData.ropani) landParts.push(`${formData.ropani} Ropani`);
        if (formData.aana) landParts.push(`${formData.aana} Aana`);
        if (formData.paisa) landParts.push(`${formData.paisa} Paisa`);
        if (formData.daam) landParts.push(`${formData.daam} Daam`);
        const formattedArea = landParts.length > 0 ? landParts.join(", ") : (formData.landArea ? `${formData.landArea} Aana` : "-");

        return (
          <dl className="space-y-2.5 text-xs font-medium text-[#342417]/80">
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Land Area:</dt>
              <dd className="font-extrabold text-[#342417]">{formattedArea}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Road Access:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.roadSize ? `${formData.roadSize} Ft` : "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Road Type:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.roadType || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Frontage:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.frontage ? `${formData.frontage} Ft` : "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Zoning:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.zoning || "-"}</dd>
            </div>
          </dl>
        );

      case "Room":
        return (
          <dl className="space-y-2.5 text-xs font-medium text-[#342417]/80">
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Floor Level:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.floorLevel || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Furnishing:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.furnishing || "-"}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[#342417]/50 font-bold">Shared Facilities:</dt>
              <dd className="font-extrabold text-[#342417] pl-2 text-[11px] leading-relaxed">
                {formData.sharedFacilities && formData.sharedFacilities.length > 0
                  ? formData.sharedFacilities.join(", ")
                  : "None"}
              </dd>
            </div>
          </dl>
        );

      case "Office Space":
        return (
          <dl className="space-y-2.5 text-xs font-medium text-[#342417]/80">
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Floor Level:</dt>
              <dd className="font-extrabold text-[#342417]">{floor || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Total Floors:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.floors || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Meeting Rooms:</dt>
              <dd className="font-extrabold text-[#342417]">{beds || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Parking Spaces:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.parking || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Built-up Area:</dt>
              <dd className="font-extrabold text-[#342417]">{builtUpArea ? `${Number(builtUpArea).toLocaleString()} Sq.Ft` : "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Carpet Area:</dt>
              <dd className="font-extrabold text-[#342417]">{carpetArea ? `${Number(carpetArea).toLocaleString()} Sq.Ft` : "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Furnishing:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.furnishing || "-"}</dd>
            </div>
          </dl>
        );

      case "Shop Space":
        return (
          <dl className="space-y-2.5 text-xs font-medium text-[#342417]/80">
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Floor Level:</dt>
              <dd className="font-extrabold text-[#342417]">{floor || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Total Floors:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.floors || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Frontage:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.frontage ? `${formData.frontage} Ft` : "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Road Access:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.roadSize ? `${formData.roadSize} Ft` : "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Road Type:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.roadType || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Built-up Area:</dt>
              <dd className="font-extrabold text-[#342417]">{builtUpArea ? `${Number(builtUpArea).toLocaleString()} Sq.Ft` : "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Furnishing:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.furnishing || "-"}</dd>
            </div>
          </dl>
        );

      default:
        return (
          <dl className="space-y-2.5 text-xs font-medium text-[#342417]/80">
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Bedrooms:</dt>
              <dd className="font-extrabold text-[#342417]">{beds || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Bathrooms:</dt>
              <dd className="font-extrabold text-[#342417]">{baths || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Balconies:</dt>
              <dd className="font-extrabold text-[#342417]">{balconies || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Floor:</dt>
              <dd className="font-extrabold text-[#342417]">{floor || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Carpet area:</dt>
              <dd className="font-extrabold text-[#342417]">{carpetArea ? `${Number(carpetArea).toLocaleString()} Sq.Ft` : "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Built-up:</dt>
              <dd className="font-extrabold text-[#342417]">{builtUpArea ? `${Number(builtUpArea).toLocaleString()} Sq.Ft` : "-"}</dd>
            </div>
            {formData.landArea && (
              <div className="flex justify-between">
                <dt className="text-[#342417]/50 font-bold">Land area:</dt>
                <dd className="font-extrabold text-[#342417]">{formData.landArea} Aana</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Facing:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.facing || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#342417]/50 font-bold">Furnishing:</dt>
              <dd className="font-extrabold text-[#342417]">{formData.furnishing || "-"}</dd>
            </div>
          </dl>
        );
    }
  };

  const coverPhoto = photos.length > 0 ? photos[0].url : "/images/property-placeholder.png";

  const formatPrice = (val: string | number) => {
    if (!val) return "Rs 0";
    return `Rs ${Number(val).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Header Card */}
      <div className="flex flex-col sm:flex-row gap-5 p-5 nm-panel shadow-sm">
        <div className="w-full sm:w-44 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-[#EBDDC0] shrink-0 shadow-[inset_0_2px_5px_rgba(90,66,38,0.18)]">
          <img
            src={coverPhoto}
            alt="Property Cover Preview"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#342417] leading-tight mb-2">
              {title || "e.g. 3BHK apartment with lift in Sanepa"}
            </h3>
            <p className="text-xs text-[#342417]/60 font-semibold mb-3">
              {propertyType} · {listingType} · {[area, city, district].filter(Boolean).join(", ") || "No location set"}
            </p>
          </div>

          <div className="pt-3 border-t border-[#F5EFE6] flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#8A3A1B]">
              {formatPrice(price)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of details divided into 3 boxes with edit anchors */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Column 1: Details */}
        <div className="p-5 nm-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E0D4C5]/50 mb-4">
              <span className="text-xs font-extrabold uppercase text-[#342417] tracking-wider">
                DETAILS
              </span>
              <button
                type="button"
                onClick={() => onGoToStep(2)}
                className="flex items-center gap-1 text-xs text-[#9A6B1E] hover:text-[#7A5418] font-bold cursor-pointer transition-colors"
              >
                Edit
              </button>
            </div>

            {renderDetailsList()}
          </div>
        </div>

        {/* Column 2: Sale Price / Rent Terms */}
        <div className="p-5 nm-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E0D4C5]/50 mb-4">
              <span className="text-xs font-extrabold uppercase text-[#342417] tracking-wider">
                {listingType === "For Rent" ? "RENT TERMS" : "SALE PRICE"}
              </span>
              <button
                type="button"
                onClick={() => onGoToStep(2)}
                className="flex items-center gap-1 text-xs text-[#9A6B1E] hover:text-[#7A5418] font-bold cursor-pointer transition-colors"
              >
                Edit
              </button>
            </div>

            {listingType === "For Rent" ? (
              <dl className="space-y-2.5 text-xs font-medium text-[#342417]/80">
                <div className="flex justify-between">
                  <dt className="text-[#342417]/50 font-bold">Monthly rent:</dt>
                  <dd className="font-extrabold text-[#342417]">{price ? Number(price).toLocaleString() : "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#342417]/50 font-bold">Deposit:</dt>
                  <dd className="font-extrabold text-[#342417]">{formData.deposit || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#342417]/50 font-bold">Min lease:</dt>
                  <dd className="font-extrabold text-[#342417]">{formData.minLease || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#342417]/50 font-bold">Available from:</dt>
                  <dd className="font-extrabold text-[#342417]">{formData.availableFrom || "-"}</dd>
                </div>
              </dl>
            ) : (
              <dl className="space-y-2.5 text-xs font-medium text-[#342417]/80">
                <div className="flex justify-between">
                  <dt className="text-[#342417]/50 font-bold">Total price:</dt>
                  <dd className="font-extrabold text-[#342417]">{price ? Number(price).toLocaleString() : "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#342417]/50 font-bold">Price / unit:</dt>
                  <dd className="font-extrabold text-[#342417]">{formData.pricePerUnit ? Number(formData.pricePerUnit).toLocaleString() : "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#342417]/50 font-bold">Ownership:</dt>
                  <dd className="font-extrabold text-[#342417]">{ownership || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#342417]/50 font-bold">Negotiable:</dt>
                  <dd className="font-extrabold text-[#342417]">{negotiable ? "Yes" : "No"}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>

        {/* Column 3: Media */}
        <div className="p-5 nm-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E0D4C5]/50 mb-4">
              <span className="text-xs font-extrabold uppercase text-[#342417] tracking-wider">
                MEDIA
              </span>
              <button
                type="button"
                onClick={() => onGoToStep(3)}
                className="flex items-center gap-1 text-xs text-[#9A6B1E] hover:text-[#7A5418] font-bold cursor-pointer transition-colors"
              >
                Edit
              </button>
            </div>

            <dl className="space-y-2.5 text-xs font-medium text-[#342417]/80">
              <div className="flex justify-between">
                <dt className="text-[#342417]/50 font-bold">Uploaded:</dt>
                <dd className="font-extrabold text-[#342417]">{photos.length} photo{photos.length !== 1 ? "s" : ""}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#342417]/50 font-bold">Cover set:</dt>
                <dd className="font-extrabold text-emerald-600 flex items-center gap-0.5">
                  ✓
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#342417]/50 font-bold">Video tour:</dt>
                <dd className="font-extrabold text-[#342417] truncate max-w-[120px]">
                  {videoLink ? "Provided" : "No video tour"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Amenities & Features */}
      {formData.amenities && formData.amenities.length > 0 && (
        <div className="p-5 nm-panel">
          <h4 className="text-xs font-extrabold uppercase text-[#342417] tracking-wider mb-3">
            AMENITIES & FEATURES
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map((amenity: string) => (
              <span
                key={amenity}
                className="nm-chip px-3 py-1.5 text-[10px] sm:text-xs font-bold text-[#342417]"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Accordance Box */}
      <div className="nm-panel p-4 text-[#342417] text-xs">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => onCheckboxChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center text-[#342417] ${termsAccepted ? "" : "border-[#CDBFA3] bg-[#ECE0C7] hover:border-[#342417]/50"}`}
              style={termsAccepted ? { borderColor: "var(--nm-accent)", backgroundColor: "var(--nm-accent)" } : undefined}
            >
              {termsAccepted && <Check className="h-3.5 w-3.5 stroke-[4]" />}
            </div>
          </div>
          <span className="text-xs text-[#342417] font-bold">
            I confirm the details are accurate and I have the right to list this property.
          </span>
        </label>
      </div>

      {errors.termsAccepted && (
        <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {errors.termsAccepted}
        </p>
      )}
    </div>
  );
}
