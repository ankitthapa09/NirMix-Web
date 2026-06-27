"use client";

import { MapPin } from "lucide-react";

interface StepLocationProps {
  formData: any;
  onChange: (data: any) => void;
  errors: Record<string, string>;
}

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

  const handleUpdate = (fields: any) => {
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Province */}
        <div>
          <label htmlFor="province-select" className="block text-sm font-bold text-[#342417] mb-2">
            Province
          </label>
          <select
            id="province-select"
            value={province || ""}
            onChange={handleProvinceChange}
            className="w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E0B33A] text-sm text-[#342417] font-medium transition-all"
          >
            <option value="" disabled>Select Province</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.province && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.province}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label htmlFor="district-select" className="block text-sm font-bold text-[#342417] mb-2">
            District
          </label>
          <select
            id="district-select"
            value={district || ""}
            disabled={!province}
            onChange={(e) => handleUpdate({ district: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E0B33A] text-sm text-[#342417] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>Select District</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.district}</p>
          )}
        </div>

        {/* City / Municipality */}
        <div>
          <label htmlFor="city-input" className="block text-sm font-bold text-[#342417] mb-2">
            City / Municipality
          </label>
          <input
            id="city-input"
            type="text"
            value={city || ""}
            onChange={(e) => handleUpdate({ city: e.target.value })}
            placeholder="e.g. Lalitpur Metro"
            className="w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white/60 focus:bg-white focus:outline-none focus:border-[#E0B33A] focus:ring-1 focus:ring-[#E0B33A] text-sm text-[#342417] placeholder-[#342417]/40 transition-all font-medium"
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.city}</p>
          )}
        </div>

        {/* Ward No */}
        <div>
          <label htmlFor="ward-no-input" className="block text-sm font-bold text-[#342417] mb-2">
            Ward No.
          </label>
          <input
            id="ward-no-input"
            type="number"
            value={wardNo || ""}
            onChange={(e) => handleUpdate({ wardNo: e.target.value })}
            placeholder="e.g. 15"
            className="w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white/60 focus:bg-white focus:outline-none focus:border-[#E0B33A] focus:ring-1 focus:ring-[#E0B33A] text-sm text-[#342417] placeholder-[#342417]/40 transition-all font-medium"
          />
          {errors.wardNo && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.wardNo}</p>
          )}
        </div>

        {/* Area / Tole */}
        <div>
          <label htmlFor="area-input" className="block text-sm font-bold text-[#342417] mb-2">
            Area / Tole
          </label>
          <input
            id="area-input"
            type="text"
            value={area || ""}
            onChange={(e) => handleUpdate({ area: e.target.value })}
            placeholder="e.g. Bhaisepati"
            className="w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white/60 focus:bg-white focus:outline-none focus:border-[#E0B33A] focus:ring-1 focus:ring-[#E0B33A] text-sm text-[#342417] placeholder-[#342417]/40 transition-all font-medium"
          />
          {errors.area && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.area}</p>
          )}
        </div>

        {/* Nearest Landmark */}
        <div>
          <label htmlFor="landmark-input" className="block text-sm font-bold text-[#342417] mb-2">
            Nearest Landmark
          </label>
          <input
            id="landmark-input"
            type="text"
            value={landmark || ""}
            onChange={(e) => handleUpdate({ landmark: e.target.value })}
            placeholder="e.g. Opposite to Civil Homes Gate"
            className="w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white/60 focus:bg-white focus:outline-none focus:border-[#E0B33A] focus:ring-1 focus:ring-[#E0B33A] text-sm text-[#342417] placeholder-[#342417]/40 transition-all font-medium"
          />
        </div>
      </div>

      {/* Interactive Map Placeholder */}
      <div className="pt-4">
        <label className="block text-sm font-bold text-[#342417] mb-2">
          Pin Exact Location
        </label>
        <div className="relative w-full h-64 rounded-2xl border-2 border-dashed border-[#E0D4C5] bg-[#F5EFE6]/40 hover:bg-[#F5EFE6]/70 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group">
          {/* Mock Map Background graphic */}
          <div className="absolute inset-0 opacity-15 pointer-events-none rounded-2xl overflow-hidden bg-[radial-gradient(circle_at_center,_#342417_1.5px,_transparent_1.5px)] bg-[size:16px_16px] flex items-center justify-center">
            {/* mock grid lines */}
            <div className="w-full h-full border-t border-b border-[#342417]/30 flex flex-col justify-around">
              <div className="h-[1px] bg-[#342417]/10" />
              <div className="h-[1px] bg-[#342417]/10" />
            </div>
          </div>
          
          <div className="z-10 p-4 rounded-full bg-[#E0B33A]/10 text-[#E0B33A] mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <MapPin className="h-7 w-7" />
          </div>
          <span className="z-10 text-sm font-bold text-[#342417]">
            Drag & Drop Pin or Click to Select
          </span>
          <span className="z-10 text-xs text-[#342417]/50 mt-1">
            Pinning exact location increases buyer trust by 45%.
          </span>
        </div>
      </div>
    </div>
  );
}
