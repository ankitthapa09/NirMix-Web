"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { PropertyFormData, StepProps } from "./types";

type StepLocationProps = StepProps;

const PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  "Koshi Province": ["Jhapa", "Ilam", "Panchthar", "Taplejung", "Morang", "Sunsari", "Dhankuta", "Terhathum", "Sankhuwasabha", "Bhojpur", "Solukhumbu", "Khotang", "Okhaldhunga", "Udayapur"],
  "Madhesh Province": ["Saptari", "Siraha", "Dhanusha", "Mahottari", "Sarlahi", "Rautahat", "Bara", "Parsa"],
  "Bagmati Province": ["Kathmandu", "Lalitpur", "Bhaktapur", "Kavrepalanchok", "Sindhupalchok", "Nuwakot", "Rasuwa", "Dhading", "Makwanpur", "Rautahat", "Sindhuli", "Ramechhap", "Dolkha"],
  "Gandaki Province": ["Kaski", "Tanahun", "Gorkha", "Lamjung", "Syangja", "Parbat", "Baglung", "Myagdi", "Mustang", "Manang", "Nawalpur"],
  "Lumbini Province": ["Rupandehi", "Kapilvastu", "Parasi", "Arghakhanchi", "Gulmi", "Palpa", "Pyuthan", "Rolpa", "Eastern Rukum", "Salyan", "Dang", "Banke", "Bardia"],
  "Karnali Province": ["Rukum West", "Salyan", "Surkhet", "Dailekh", "Jajarkot", "Dolpa", "Jumla", "Kalikot", "Mugu", "Humla"],
  "Sudurpashchim Province": ["Bajura", "Bajhang", "Darchula", "Baitadi", "Dadeldhura", "Kanchanpur", "Doti", "Kailali", "Achham"],
};

export function StepLocation({ formData, onChange, errors }: StepLocationProps) {
  const { province, district, city, wardNo, area, landmark } = formData;

  const handleUpdate = (fields: Partial<PropertyFormData>) => {
    onChange({ ...formData, ...fields });
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = e.target.value;
    handleUpdate({
      province: selectedProvince,
      district: "", // reset district on province change
    });
  };

  const districts = province ? DISTRICTS_BY_PROVINCE[province] || [] : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Province */}
        <div>
          <label htmlFor="province-select" className="nm-label">Province</label>
          <div className="relative">
            <select
              id="province-select"
              value={province || ""}
              onChange={handleProvinceChange}
              className="nm-input appearance-none cursor-pointer px-4 py-3 pr-10 text-xs font-semibold"
            >
              <option value="" disabled>Select Province</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#342417]/50 pointer-events-none" />
          </div>
          {errors.province && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.province}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label htmlFor="district-select" className="nm-label">District</label>
          <div className="relative">
            <select
              id="district-select"
              value={district || ""}
              disabled={!province}
              onChange={(e) => handleUpdate({ district: e.target.value })}
              className="nm-input appearance-none cursor-pointer px-4 py-3 pr-10 text-xs font-semibold"
            >
              <option value="" disabled>Select District</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#342417]/50 pointer-events-none" />
          </div>
          {errors.district && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.district}</p>
          )}
        </div>

        {/* City / Municipality */}
        <div>
          <label htmlFor="city-input" className="nm-label">City / Municipality</label>
          <input
            id="city-input"
            type="text"
            value={city || ""}
            onChange={(e) => handleUpdate({ city: e.target.value })}
            placeholder="e.g. Lalitpur Metro"
            className="nm-input px-4 py-3 text-xs font-semibold"
          />
          {errors.city && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.city}</p>
          )}
        </div>

        {/* Ward No */}
        <div>
          <label htmlFor="ward-no-input" className="nm-label">Ward No.</label>
          <input
            id="ward-no-input"
            type="number"
            value={wardNo || ""}
            onChange={(e) => handleUpdate({ wardNo: e.target.value })}
            placeholder="e.g. 15"
            className="nm-input px-4 py-3 text-xs font-semibold"
          />
          {errors.wardNo && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.wardNo}</p>
          )}
        </div>

        {/* Area / Tole */}
        <div>
          <label htmlFor="area-input" className="nm-label">Area / Tole</label>
          <input
            id="area-input"
            type="text"
            value={area || ""}
            onChange={(e) => handleUpdate({ area: e.target.value })}
            placeholder="e.g. Bhaisepati"
            className="nm-input px-4 py-3 text-xs font-semibold"
          />
          {errors.area && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.area}</p>
          )}
        </div>

        {/* Nearest Landmark */}
        <div>
          <label htmlFor="landmark-input" className="nm-label">Nearest Landmark</label>
          <input
            id="landmark-input"
            type="text"
            value={landmark || ""}
            onChange={(e) => handleUpdate({ landmark: e.target.value })}
            placeholder="e.g. Opposite to Civil Homes Gate"
            className="nm-input px-4 py-3 text-xs font-semibold"
          />
        </div>
      </div>

      {/* Interactive Map Placeholder — carved into the board */}
      <div className="pt-2">
        <label className="nm-label">Pin Exact Location</label>
        <div className="nm-recessed relative w-full h-64 flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
          {/* Mock Map Background graphic */}
          <div className="absolute inset-0 opacity-15 pointer-events-none rounded-2xl overflow-hidden bg-[radial-gradient(circle_at_center,_#342417_1.5px,_transparent_1.5px)] bg-[size:16px_16px] flex items-center justify-center">
            {/* mock grid lines */}
            <div className="w-full h-full border-t border-b border-[#342417]/30 flex flex-col justify-around">
              <div className="h-[1px] bg-[#342417]/10" />
              <div className="h-[1px] bg-[#342417]/10" />
            </div>
          </div>
          
          <div
            className="z-10 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm"
            style={{ backgroundColor: "var(--nm-accent-soft)", color: "var(--nm-accent)" }}
          >
            <MapPin className="h-7 w-7" />
          </div>
          <span className="z-10 text-sm font-bold text-[#342417]">
            Drag & Drop Pin or Click to Select
          </span>
          <span className="z-10 text-xs text-[#342417]/55 mt-1">
            Pinning exact location increases buyer trust by 45%.
          </span>
        </div>
      </div>
    </div>
  );
}
