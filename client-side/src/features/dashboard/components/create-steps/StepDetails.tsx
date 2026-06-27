"use client";

import { useEffect } from "react";

interface StepDetailsProps {
  formData: any;
  onChange: (data: any) => void;
  errors: Record<string, string>;
}

const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const OWNERSHIP_OPTIONS = ["Freehold (Lalpurja)", "Leasehold", "Guthi"];
const FURNISHING_OPTIONS = ["Unfurnished", "Semi-furnished", "Fully furnished"];
const ZONING_OPTIONS = ["Residential", "Commercial", "Agricultural", "Industrial"];
const ROAD_TYPE_OPTIONS = ["Pitched", "Gravel", "Soil", "Blacktopped", "Concrete", "Paved"];
const AMENITIES_HOUSE = ["24/7 Water", "Backup Power", "Private Garden", "Security Guard", "Internet Ready", "Parking Space", "CCTV Cameras", "Solar Water Heater"];
const AMENITIES_APARTMENT = ["24/7 Water", "Backup Power", "Gym", "Swimming Pool", "Elevator/Lift", "Security Guard", "Internet Ready", "Community Hall"];
const AMENITIES_LAND = ["Boundary wall", "Road-level plot", "Corner plot", "Water access", "Electricity", "Drainage"];
const AMENITIES_ROOM = ["24/7 Water", "Backup Power", "Internet Ready", "Laundry Access", "Attached Bathroom", "Shared Kitchen"];

export function StepDetails({ formData, onChange, errors }: StepDetailsProps) {
  const { listingType, propertyType } = formData;

  const handleUpdate = (fields: any) => {
    onChange({ ...formData, ...fields });
  };

  // Autocalculate price per unit (Price/Sq.Ft or Price/Aana)
  useEffect(() => {
    const price = Number(formData.price) || 0;
    
    if (propertyType === "Land") {
      const aana = Number(formData.landArea) || 0;
      if (price > 0 && aana > 0) {
        const pricePerAana = Math.round(price / aana);
        if (formData.pricePerUnit !== pricePerAana) {
          handleUpdate({ pricePerUnit: pricePerAana });
        }
      } else if (formData.pricePerUnit) {
        handleUpdate({ pricePerUnit: 0 });
      }
    } else if (propertyType === "Apartment" || propertyType === "House") {
      const sqft = Number(formData.builtUpArea) || 0;
      if (price > 0 && sqft > 0) {
        const pricePerSqFt = Math.round(price / sqft);
        if (formData.pricePerUnit !== pricePerSqFt) {
          handleUpdate({ pricePerUnit: pricePerSqFt });
        }
      } else if (formData.pricePerUnit) {
        handleUpdate({ pricePerUnit: 0 });
      }
    }
  }, [formData.price, formData.landArea, formData.builtUpArea, propertyType]);

  const handleAmenityToggle = (amenity: string) => {
    const amenities = formData.amenities || [];
    if (amenities.includes(amenity)) {
      handleUpdate({ amenities: amenities.filter((a: string) => a !== amenity) });
    } else {
      handleUpdate({ amenities: [...amenities, amenity] });
    }
  };

  const handleAreaChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    const r = Number(updated.ropani) || 0;
    const a = Number(updated.aana) || 0;
    const p = Number(updated.paisa) || 0;
    const d = Number(updated.daam) || 0;
    
    // Kathmandu Hills Area Conversion:
    // 1 Ropani = 16 Aana
    // 1 Aana = 4 Paisa
    // 1 Paisa = 4 Daam
    const totalAana = (r * 16) + a + (p / 4) + (d / 16);
    
    onChange({
      ...updated,
      landArea: totalAana > 0 ? String(totalAana) : ""
    });
  };

  const handleSharedFacilityToggle = (facility: string) => {
    const facilities = formData.sharedFacilities || [];
    if (facilities.includes(facility)) {
      handleUpdate({ sharedFacilities: facilities.filter((f: string) => f !== facility) });
    } else {
      handleUpdate({ sharedFacilities: [...facilities, facility] });
    }
  };

  const formatCurrency = (val: number) => {
    if (!val) return "Rs. 0";
    return `Rs. ${val.toLocaleString()}`;
  };

  // Shared generic input styles
  const inputStyle = "w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white/60 focus:bg-white focus:outline-none focus:border-[#E0B33A] focus:ring-1 focus:ring-[#E0B33A] text-sm text-[#342417] placeholder-[#342417]/40 transition-all font-medium";
  const labelStyle = "block text-xs font-bold text-[#342417] mb-2 uppercase tracking-wider";

  // House layout
  const renderHouseForm = () => {
    const isSale = listingType === "For Sale";
    const amenitiesList = ["Water 24/7", "Backup power", "Lift", "Garden", "Security", "Internet ready"];

    return (
      <div className="space-y-6">
        {/* SALE PRICE BOX (or RENTAL PRICE) */}
        <div className="p-5 rounded-2xl bg-[#FFC71E]/5 border border-[#E0B33A]/30 space-y-4">
          <span className="text-[10px] font-extrabold uppercase text-[#E0B33A] tracking-wider">
            {isSale ? "Sale Price" : "Rental Price"}
          </span>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label htmlFor="house-price" className={`${labelStyle} text-xs`}>
                {isSale ? "TOTAL PRICE (RS)" : "RENTAL PRICE (RS/MONTH)"}
              </label>
              <input
                id="house-price"
                type="number"
                value={formData.price || ""}
                onChange={(e) => handleUpdate({ price: e.target.value })}
                placeholder={isSale ? "e.g. 8500000" : "e.g. 45000"}
                className={`${inputStyle} bg-white`}
              />
              {formData.price && (
                <p className="mt-1 text-[11px] text-[#342417]/60 font-bold">
                  {formatCurrency(Number(formData.price))}
                </p>
              )}
            </div>

            <div className="w-full md:w-48">
              <label htmlFor="house-price-unit" className={`${labelStyle} text-xs`}>
                PRICE / UNIT (RS)
              </label>
              <input
                id="house-price-unit"
                type="number"
                value={formData.pricePerUnit || ""}
                onChange={(e) => handleUpdate({ pricePerUnit: e.target.value })}
                placeholder="e.g. 7083"
                className={`${inputStyle} bg-white`}
              />
            </div>

            <div className="w-full md:w-56">
              <label htmlFor="house-ownership" className={`${labelStyle} text-xs`}>
                OWNERSHIP
              </label>
              <select
                id="house-ownership"
                value={formData.ownership || ""}
                onChange={(e) => handleUpdate({ ownership: e.target.value })}
                className="w-full h-[46px] px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E0B33A] text-sm text-[#342417] font-medium transition-all"
              >
                <option value="" disabled>Select Ownership</option>
                {OWNERSHIP_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleUpdate({ negotiable: !formData.negotiable })}
                className={`w-full md:w-auto px-6 h-[46px] rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all border-2 cursor-pointer ${
                  formData.negotiable
                    ? "bg-[#E0B33A] border-[#E0B33A] text-[#342417]"
                    : "border-[#E0D4C5] bg-white text-[#342417]/60"
                }`}
              >
                Negotiable {formData.negotiable && "✓"}
              </button>
            </div>
          </div>
          {errors.price && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.price}</p>}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="house-beds" className={labelStyle}>BEDROOMS</label>
            <input
              id="house-beds"
              type="number"
              value={formData.beds || ""}
              onChange={(e) => handleUpdate({ beds: e.target.value })}
              placeholder="e.g. 4"
              className={inputStyle}
            />
            {errors.beds && <p className="mt-1 text-xs text-red-500">{errors.beds}</p>}
          </div>

          <div>
            <label htmlFor="house-baths" className={labelStyle}>BATHROOMS</label>
            <input
              id="house-baths"
              type="number"
              value={formData.baths || ""}
              onChange={(e) => handleUpdate({ baths: e.target.value })}
              placeholder="e.g. 3"
              className={inputStyle}
            />
            {errors.baths && <p className="mt-1 text-xs text-red-500">{errors.baths}</p>}
          </div>

          <div>
            <label htmlFor="house-floors" className={labelStyle}>TOTAL FLOORS</label>
            <input
              id="house-floors"
              type="number"
              step="0.5"
              value={formData.floors || ""}
              onChange={(e) => handleUpdate({ floors: e.target.value })}
              placeholder="e.g. 2.5"
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="house-parking" className={labelStyle}>PARKING</label>
            <input
              id="house-parking"
              type="text"
              value={formData.parking || ""}
              onChange={(e) => handleUpdate({ parking: e.target.value })}
              placeholder="e.g. 2 cars"
              className={inputStyle}
            />
          </div>
        </div>

        {/* Specs Row 2 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="house-builtup" className={labelStyle}>BUILT-UP AREA (SQ.FT)</label>
            <input
              id="house-builtup"
              type="number"
              value={formData.builtUpArea || ""}
              onChange={(e) => handleUpdate({ builtUpArea: e.target.value })}
              placeholder="e.g. 2,400"
              className={inputStyle}
            />
            {errors.builtUpArea && <p className="mt-1 text-xs text-red-500">{errors.builtUpArea}</p>}
          </div>

          <div>
            <label htmlFor="house-landarea" className={labelStyle}>LAND AREA (AANA)</label>
            <input
              id="house-landarea"
              type="number"
              value={formData.landArea || ""}
              onChange={(e) => handleUpdate({ landArea: e.target.value })}
              placeholder="e.g. 4"
              className={inputStyle}
            />
            {errors.landArea && <p className="mt-1 text-xs text-red-500">{errors.landArea}</p>}
          </div>

          <div>
            <label htmlFor="house-facing" className={labelStyle}>FACING</label>
            <select
              id="house-facing"
              value={formData.facing || ""}
              onChange={(e) => handleUpdate({ facing: e.target.value })}
              className="w-full h-[46px] px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E0B33A] text-sm text-[#342417] font-medium transition-all"
            >
              <option value="" disabled>Select Facing</option>
              {FACING_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Furnishing */}
        <div>
          <label className={labelStyle}>FURNISHING</label>
          <div className="flex flex-wrap gap-3">
            {FURNISHING_OPTIONS.map((f) => {
              const isActive = formData.furnishing === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleUpdate({ furnishing: f })}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2 cursor-pointer ${
                    isActive
                      ? "bg-[#E0B33A] border-[#E0B33A] text-[#342417]"
                      : "border-[#E0D4C5] bg-white text-[#342417]/60 hover:border-[#342417]/30"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className={labelStyle}>AMENITIES</label>
          <div className="flex flex-wrap gap-2.5">
            {amenitiesList.map((amenity) => {
              const isChecked = (formData.amenities || []).includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-[#E0B33A] border-[#E0B33A] text-[#342417]"
                      : "border-[#E0D4C5] bg-white text-[#342417]/60 hover:border-[#342417]/30"
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Apartment layout
  const renderApartmentForm = () => {
    const isSale = listingType === "For Sale";
    const amenitiesList = ["Lift", "Covered parking", "24/7 security", "Gym", "Clubhouse", "Power backup"];

    return (
      <div className="space-y-6">
        {/* SALE PRICE BOX (or RENTAL PRICE) */}
        <div className="p-5 rounded-2xl bg-[#FFC71E]/5 border border-[#E0B33A]/30 space-y-4">
          <span className="text-[10px] font-extrabold uppercase text-[#E0B33A] tracking-wider">
            {isSale ? "Sale Price" : "Rental Price"}
          </span>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label htmlFor="apartment-price" className={`${labelStyle} text-xs`}>
                {isSale ? "TOTAL PRICE (RS)" : "RENTAL PRICE (RS/MONTH)"}
              </label>
              <input
                id="apartment-price"
                type="number"
                value={formData.price || ""}
                onChange={(e) => handleUpdate({ price: e.target.value })}
                placeholder={isSale ? "e.g. 8500000" : "e.g. 45000"}
                className={`${inputStyle} bg-white`}
              />
              {formData.price && (
                <p className="mt-1 text-[11px] text-[#342417]/60 font-bold">
                  {formatCurrency(Number(formData.price))}
                </p>
              )}
            </div>

            <div className="w-full md:w-48">
              <label htmlFor="apartment-price-unit" className={`${labelStyle} text-xs`}>
                PRICE / UNIT (RS)
              </label>
              <input
                id="apartment-price-unit"
                type="number"
                value={formData.pricePerUnit || ""}
                onChange={(e) => handleUpdate({ pricePerUnit: e.target.value })}
                placeholder="e.g. 7083"
                className={`${inputStyle} bg-white`}
              />
            </div>

            <div className="w-full md:w-56">
              <label htmlFor="apartment-ownership" className={`${labelStyle} text-xs`}>
                OWNERSHIP
              </label>
              <select
                id="apartment-ownership"
                value={formData.ownership || ""}
                onChange={(e) => handleUpdate({ ownership: e.target.value })}
                className="w-full h-[46px] px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E0B33A] text-sm text-[#342417] font-medium transition-all"
              >
                <option value="" disabled>Select Ownership</option>
                {OWNERSHIP_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleUpdate({ negotiable: !formData.negotiable })}
                className={`w-full md:w-auto px-6 h-[46px] rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all border-2 cursor-pointer ${
                  formData.negotiable
                    ? "bg-[#E0B33A] border-[#E0B33A] text-[#342417]"
                    : "border-[#E0D4C5] bg-white text-[#342417]/60"
                }`}
              >
                Negotiable {formData.negotiable && "✓"}
              </button>
            </div>
          </div>
          {errors.price && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.price}</p>}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="apartment-beds" className={labelStyle}>BEDROOMS</label>
            <input
              id="apartment-beds"
              type="number"
              value={formData.beds || ""}
              onChange={(e) => handleUpdate({ beds: e.target.value })}
              placeholder="e.g. 4"
              className={inputStyle}
            />
            {errors.beds && <p className="mt-1 text-xs text-red-500">{errors.beds}</p>}
          </div>

          <div>
            <label htmlFor="apartment-baths" className={labelStyle}>BATHROOMS</label>
            <input
              id="apartment-baths"
              type="number"
              value={formData.baths || ""}
              onChange={(e) => handleUpdate({ baths: e.target.value })}
              placeholder="e.g. 3"
              className={inputStyle}
            />
            {errors.baths && <p className="mt-1 text-xs text-red-500">{errors.baths}</p>}
          </div>

          <div>
            <label htmlFor="apartment-balconies" className={labelStyle}>BALCONIES</label>
            <input
              id="apartment-balconies"
              type="number"
              value={formData.balconies || ""}
              onChange={(e) => handleUpdate({ balconies: e.target.value })}
              placeholder="e.g. 2"
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="apartment-floor" className={labelStyle}>FLOOR</label>
            <input
              id="apartment-floor"
              type="text"
              value={formData.floor || ""}
              onChange={(e) => handleUpdate({ floor: e.target.value })}
              placeholder="e.g. 7th of 12"
              className={inputStyle}
            />
          </div>
        </div>

        {/* Specs Row 2 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="apartment-carpet" className={labelStyle}>CARPET AREA (SQ.FT)</label>
            <input
              id="apartment-carpet"
              type="number"
              value={formData.carpetArea || ""}
              onChange={(e) => handleUpdate({ carpetArea: e.target.value })}
              placeholder="e.g. 1000"
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="apartment-builtup" className={labelStyle}>BUILT-UP (SQ.FT)</label>
            <input
              id="apartment-builtup"
              type="number"
              value={formData.builtUpArea || ""}
              onChange={(e) => handleUpdate({ builtUpArea: e.target.value })}
              placeholder="e.g. 2400"
              className={inputStyle}
            />
            {errors.builtUpArea && <p className="mt-1 text-xs text-red-500">{errors.builtUpArea}</p>}
          </div>

          <div>
            <label htmlFor="apartment-facing" className={labelStyle}>FACING</label>
            <select
              id="apartment-facing"
              value={formData.facing || ""}
              onChange={(e) => handleUpdate({ facing: e.target.value })}
              className="w-full h-[46px] px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E0B33A] text-sm text-[#342417] font-medium transition-all"
            >
              <option value="" disabled>Select Facing</option>
              {FACING_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Furnishing */}
        <div>
          <label className={labelStyle}>FURNISHING</label>
          <div className="flex flex-wrap gap-3">
            {FURNISHING_OPTIONS.map((f) => {
              const isActive = formData.furnishing === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleUpdate({ furnishing: f })}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2 cursor-pointer ${
                    isActive
                      ? "bg-[#E0B33A] border-[#E0B33A] text-[#342417]"
                      : "border-[#E0D4C5] bg-white text-[#342417]/60 hover:border-[#342417]/30"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Building Amenities */}
        <div>
          <label className={labelStyle}>BUILDING AMENITIES</label>
          <div className="flex flex-wrap gap-2.5">
            {amenitiesList.map((amenity) => {
              const isChecked = (formData.amenities || []).includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-[#E0B33A] border-[#E0B33A] text-[#342417]"
                      : "border-[#E0D4C5] bg-white text-[#342417]/60 hover:border-[#342417]/30"
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Land layout
  const renderLandForm = () => {
    const isSale = listingType === "For Sale";
    const amenitiesList = AMENITIES_LAND;

    return (
      <div className="space-y-6">
        {/* SALE PRICE BOX (or RENTAL PRICE) */}
        <div className="p-5 rounded-2xl bg-[#FFC71E]/5 border border-[#E0B33A]/30 space-y-4">
          <span className="text-[10px] font-extrabold uppercase text-[#E0B33A] tracking-wider">
            {isSale ? "Sale Price" : "Rental Price"}
          </span>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label htmlFor="land-price" className={`${labelStyle} text-xs`}>
                {isSale ? "TOTAL PRICE (RS)" : "RENTAL PRICE (RS/MONTH)"}
              </label>
              <input
                id="land-price"
                type="number"
                value={formData.price || ""}
                onChange={(e) => handleUpdate({ price: e.target.value })}
                placeholder={isSale ? "e.g. 85000000" : "e.g. 50000"}
                className={`${inputStyle} bg-white`}
              />
              {formData.price && (
                <p className="mt-1 text-[11px] text-[#342417]/60 font-bold">
                  {formatCurrency(Number(formData.price))} {!isSale && "/ month"}
                </p>
              )}
            </div>

            <div className="w-full md:w-48">
              <label htmlFor="land-price-unit" className={`${labelStyle} text-xs`}>
                PRICE / UNIT (RS)
              </label>
              <input
                id="land-price-unit"
                type="number"
                value={formData.pricePerUnit || ""}
                onChange={(e) => handleUpdate({ pricePerUnit: e.target.value })}
                placeholder="e.g. 7083"
                className={`${inputStyle} bg-white`}
              />
            </div>

            {isSale ? (
              <div className="w-full md:w-56">
                <label htmlFor="land-ownership" className={`${labelStyle} text-xs`}>
                  OWNERSHIP
                </label>
                <select
                  id="land-ownership"
                  value={formData.ownership || ""}
                  onChange={(e) => handleUpdate({ ownership: e.target.value })}
                  className="w-full h-[46px] px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E0B33A] text-sm text-[#342417] font-medium transition-all"
                >
                  <option value="" disabled>Select Ownership</option>
                  {OWNERSHIP_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="w-full md:w-56">
                <label htmlFor="land-leaseterm" className={`${labelStyle} text-xs`}>
                  LEASE TERM (YEARS)
                </label>
                <input
                  id="land-leaseterm"
                  type="number"
                  value={formData.leaseTerm || ""}
                  onChange={(e) => handleUpdate({ leaseTerm: e.target.value })}
                  placeholder="e.g. 5"
                  className={`${inputStyle} bg-white`}
                />
              </div>
            )}

            <div className="w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleUpdate({ negotiable: !formData.negotiable })}
                className={`w-full md:w-auto px-6 h-[46px] rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all border-2 cursor-pointer ${
                  formData.negotiable
                    ? "bg-[#E0B33A] border-[#E0B33A] text-[#342417]"
                    : "border-[#E0D4C5] bg-white text-[#342417]/60"
                }`}
              >
                Negotiable {formData.negotiable && "✓"}
              </button>
            </div>
          </div>
          {errors.price && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.price}</p>}
        </div>

        {/* LAND AREA row */}
        <div>
          <label className={labelStyle}>Land Area</label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="relative">
              <input
                type="number"
                value={formData.ropani || ""}
                onChange={(e) => handleAreaChange("ropani", e.target.value)}
                className={`${inputStyle} pr-16 bg-white`}
                placeholder="0"
              />
              <span className="absolute right-4 top-3.5 text-[10px] text-[#342417]/50 font-bold uppercase pointer-events-none">Ropani</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={formData.aana || ""}
                onChange={(e) => handleAreaChange("aana", e.target.value)}
                className={`${inputStyle} pr-16 bg-white`}
                placeholder="0"
              />
              <span className="absolute right-4 top-3.5 text-[10px] text-[#342417]/50 font-bold uppercase pointer-events-none">Aana</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={formData.paisa || ""}
                onChange={(e) => handleAreaChange("paisa", e.target.value)}
                className={`${inputStyle} pr-16 bg-white`}
                placeholder="0"
              />
              <span className="absolute right-4 top-3.5 text-[10px] text-[#342417]/50 font-bold uppercase pointer-events-none">Paisa</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={formData.daam || ""}
                onChange={(e) => handleAreaChange("daam", e.target.value)}
                className={`${inputStyle} pr-16 bg-white`}
                placeholder="0"
              />
              <span className="absolute right-4 top-3.5 text-[10px] text-[#342417]/50 font-bold uppercase pointer-events-none">Daam</span>
            </div>
          </div>
          {errors.landArea && <p className="mt-2 text-xs text-red-500 font-semibold">{errors.landArea}</p>}
          {formData.landArea && (
            <p className="mt-1 text-[11px] text-[#342417]/60 font-bold">
              Total Calculated Area: {Number(formData.landArea).toFixed(3)} Aana
            </p>
          )}
        </div>

        {/* ZONING / LAND TYPE selector */}
        <div>
          <label className={labelStyle}>Zoning / Land Type</label>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {ZONING_OPTIONS.map((z) => {
              const isSelected = formData.zoning === z;
              return (
                <button
                  key={z}
                  type="button"
                  onClick={() => handleUpdate({ zoning: z })}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#E5C158] border-[#E5C158] text-[#342417]"
                      : "border-[#E0D4C5] bg-white/40 text-[#342417]/60 hover:bg-white/80"
                  }`}
                >
                  {z}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROAD ACCESS WIDTH (FT) & FRONTAGE (FT) & ROAD TYPE row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Road Access Width */}
          <div>
            <label htmlFor="land-roadsize" className={labelStyle}>Road Access Width (Ft)</label>
            <input
              id="land-roadsize"
              type="number"
              value={formData.roadSize || ""}
              onChange={(e) => handleUpdate({ roadSize: e.target.value })}
              placeholder="e.g. 20"
              className={inputStyle}
            />
          </div>

          {/* Frontage */}
          <div>
            <label htmlFor="land-frontage" className={labelStyle}>Frontage (Ft)</label>
            <input
              id="land-frontage"
              type="number"
              value={formData.frontage || ""}
              onChange={(e) => handleUpdate({ frontage: e.target.value })}
              placeholder="e.g. 42"
              className={inputStyle}
            />
          </div>

          {/* Road Type */}
          <div>
            <label htmlFor="land-roadtype" className={labelStyle}>Road Type</label>
            <select
              id="land-roadtype"
              value={formData.roadType || ""}
              onChange={(e) => handleUpdate({ roadType: e.target.value })}
              className="w-full h-[46px] px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E0B33A] text-sm text-[#342417] font-medium transition-all"
            >
              <option value="" disabled>Select Road Type</option>
              {ROAD_TYPE_OPTIONS.map((rt) => (
                <option key={rt} value={rt}>{rt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* SITE FEATURES (Amenities / Utilities Available) */}
        <div>
          <label className={labelStyle}>Site Features</label>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {amenitiesList.map((feature) => {
              const isChecked = (formData.amenities || []).includes(feature);
              return (
                <button
                  key={feature}
                  type="button"
                  onClick={() => handleAmenityToggle(feature)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-[#E5C158] border-[#E5C158] text-[#342417]"
                      : "border-[#E0D4C5] bg-white/40 text-[#342417]/60 hover:bg-white/80"
                  }`}
                >
                  {feature}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Room layout
  const renderRoomForm = () => {
    const amenitiesList = AMENITIES_ROOM;
    const facilitiesList = ["Shared Kitchen", "Shared Bathroom", "Shared Living Room", "Shared Balcony", "Private Balcony"];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Price */}
          <div>
            <label htmlFor="room-price" className={labelStyle}>Rental Price (Rs/Month)</label>
            <input
              id="room-price"
              type="number"
              value={formData.price || ""}
              onChange={(e) => handleUpdate({ price: e.target.value })}
              placeholder="e.g. 15000"
              className={inputStyle}
            />
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            {formData.price && (
              <p className="mt-1 text-[11px] text-[#342417]/60 font-bold">
                {formatCurrency(Number(formData.price))} / month
              </p>
            )}
          </div>

          {/* Deposit */}
          <div>
            <label htmlFor="room-deposit" className={labelStyle}>Security Deposit (Rs)</label>
            <input
              id="room-deposit"
              type="number"
              value={formData.deposit || ""}
              onChange={(e) => handleUpdate({ deposit: e.target.value })}
              placeholder="e.g. 15000"
              className={inputStyle}
            />
          </div>

          {/* Utilities included toggle */}
          <div>
            <label className={labelStyle}>Utilities Included</label>
            <div className="flex p-1 bg-[#F5EFE6] rounded-xl border border-[#E0D4C5] h-[46px]">
              <button
                type="button"
                onClick={() => handleUpdate({ utilitiesIncluded: true })}
                className={`flex-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  formData.utilitiesIncluded === true
                    ? "bg-[#342417] text-white"
                    : "text-[#342417]/60 hover:text-[#342417]"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleUpdate({ utilitiesIncluded: false })}
                className={`flex-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  formData.utilitiesIncluded === false
                    ? "bg-[#342417] text-white"
                    : "text-[#342417]/60 hover:text-[#342417]"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Floor Level */}
          <div>
            <label htmlFor="room-floor" className={labelStyle}>Floor Level</label>
            <input
              id="room-floor"
              type="number"
              value={formData.floorLevel || ""}
              onChange={(e) => handleUpdate({ floorLevel: e.target.value })}
              placeholder="e.g. 2"
              className={inputStyle}
            />
          </div>

          {/* Furnishing */}
          <div>
            <label htmlFor="room-furnishing" className={labelStyle}>Furnishing State</label>
            <select
              id="room-furnishing"
              value={formData.furnishing || ""}
              onChange={(e) => handleUpdate({ furnishing: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E0B33A] text-sm text-[#342417] font-medium transition-all"
            >
              <option value="" disabled>Select Furnishing</option>
              {FURNISHING_OPTIONS.map((fu) => (
                <option key={fu} value={fu}>{fu}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shared Facilities */}
        <div>
          <label className={labelStyle}>Shared Facilities</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facilitiesList.map((facility) => {
              const isChecked = (formData.sharedFacilities || []).includes(facility);
              return (
                <button
                  key={facility}
                  type="button"
                  onClick={() => handleSharedFacilityToggle(facility)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                    isChecked
                      ? "border-[#E0B33A] bg-[#E0B33A]/5 text-[#342417]"
                      : "border-[#E0D4C5] bg-white/40 text-[#342417]/70 hover:bg-white/80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-[#E0B33A] focus:ring-[#E0B33A]"
                  />
                  <span className="text-xs font-semibold">{facility}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className={labelStyle}>Amenities</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {amenitiesList.map((amenity) => {
              const isChecked = (formData.amenities || []).includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                    isChecked
                      ? "border-[#E0B33A] bg-[#E0B33A]/5 text-[#342417]"
                      : "border-[#E0D4C5] bg-white/40 text-[#342417]/70 hover:bg-white/80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-[#E0B33A] focus:ring-[#E0B33A]"
                  />
                  <span className="text-xs font-semibold">{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  switch (propertyType) {
    case "House":
      return renderHouseForm();
    case "Apartment":
      return renderApartmentForm();
    case "Land":
      return renderLandForm();
    case "Room":
      return renderRoomForm();
    default:
      return (
        <div className="p-8 text-center text-[#342417]/60 font-semibold border-2 border-dashed border-[#E0D4C5] rounded-2xl">
          Please select a property type in the Basics step first.
        </div>
      );
  }
}
