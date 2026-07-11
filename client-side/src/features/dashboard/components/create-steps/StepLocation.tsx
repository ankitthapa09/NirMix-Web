"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MapPin, ChevronDown, Loader2 } from "lucide-react";
import { PropertyFormData, StepProps } from "./types";
import type { LatLng } from "./LocationPicker";
import { reverseGeocode } from "@/lib/geocode";

// Leaflet touches `window`, so the picker must never render during SSR.
const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="nm-recessed flex h-64 w-full items-center justify-center text-xs font-semibold text-[#342417]/55">
      Loading map…
    </div>
  ),
});

type StepLocationProps = StepProps;

// Rough district centers so the map opens near the listing; falls back to Kathmandu.
const DISTRICT_CENTERS: Record<string, LatLng> = {
  Kathmandu: { lat: 27.7172, lng: 85.324 },
  Lalitpur: { lat: 27.6588, lng: 85.3247 },
  Bhaktapur: { lat: 27.671, lng: 85.4298 },
  Kaski: { lat: 28.2096, lng: 83.9856 },
  Morang: { lat: 26.6646, lng: 87.2718 },
  Sunsari: { lat: 26.6265, lng: 87.1718 },
  Rupandehi: { lat: 27.6244, lng: 83.4419 },
};
const DEFAULT_CENTER: LatLng = { lat: 27.7172, lng: 85.324 };

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

const ALL_DISTRICTS = Object.values(DISTRICTS_BY_PROVINCE).flat();

// e.g. "Bagmati Province" / "Bagmati Pradesh" → "bagmati".
const norm = (s: string) => s.toLowerCase().replace(/province|pradesh|district/g, "").replace(/[^a-z]/g, "");

/** Map a geocoded state name onto one of the seven province options (best-effort). */
function matchProvince(state?: string): string {
  if (!state) return "";
  const n = norm(state);
  if (!n) return "";
  return PROVINCES.find((p) => norm(p) === n || norm(p).includes(n) || n.includes(norm(p))) ?? "";
}

/** Map a geocoded district name onto a district option (searched across all provinces). */
function matchDistrict(district?: string): string {
  if (!district) return "";
  const n = norm(district);
  if (!n) return "";
  return ALL_DISTRICTS.find((d) => norm(d) === n || norm(d).includes(n) || n.includes(norm(d))) ?? "";
}

/** The province that owns a district (first match). */
function provinceOfDistrict(district: string): string {
  return Object.entries(DISTRICTS_BY_PROVINCE).find(([, list]) => list.includes(district))?.[0] ?? "";
}

export function StepLocation({ formData, onChange, errors }: StepLocationProps) {
  const { province, district, city, wardNo, area, landmark, coordinates } = formData;
  const mapCenter = (district && DISTRICT_CENTERS[district]) || DEFAULT_CENTER;
  const pinColor = formData.listingType === "For Rent" ? "#157A74" : "#B05B33";
  const [geoLoading, setGeoLoading] = useState(false);

  const handleUpdate = (fields: Partial<PropertyFormData>) => {
    onChange({ ...formData, ...fields });
  };

  // Reverse-geocode the pin and auto-fill the address; province/district are
  // matched to our fixed option lists, city/area/landmark are free-filled.
  const applyGeocode = async (coords: LatLng) => {
    setGeoLoading(true);
    try {
      const addr = await reverseGeocode(coords.lat, coords.lng);
      if (!addr) return;

      // District names are reliable; province is inferred from the district
      // when the state name doesn't match (OSM sometimes misspells provinces).
      const matchedDistrict = matchDistrict(addr.district);
      let matchedProvince = matchProvince(addr.province) || provinceOfDistrict(matchedDistrict);
      if (matchedDistrict && matchedProvince && !DISTRICTS_BY_PROVINCE[matchedProvince]?.includes(matchedDistrict)) {
        matchedProvince = provinceOfDistrict(matchedDistrict);
      }

      const patch: Partial<PropertyFormData> = { coordinates: coords };
      if (matchedProvince) patch.province = matchedProvince;
      if (matchedDistrict) patch.district = matchedDistrict;
      if (addr.city) patch.city = addr.city;
      if (addr.area) patch.area = addr.area;
      if (addr.landmark) patch.landmark = addr.landmark;
      handleUpdate(patch);
    } finally {
      setGeoLoading(false);
    }
  };

  const handlePin = (coords: LatLng) => {
    handleUpdate({ coordinates: coords }); // drop the pin instantly
    void applyGeocode(coords); // then fill the address
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

      {/* Interactive Map — pin the exact location */}
      <div className="pt-2">
        <div className="mb-2 flex items-center justify-between">
          <label className="nm-label mb-0">Pin Exact Location</label>
          {coordinates && (
            <button
              type="button"
              onClick={() => handleUpdate({ coordinates: undefined })}
              className="text-xs font-semibold text-[#B05B33] hover:underline"
            >
              Clear pin
            </button>
          )}
        </div>

        <div className="nm-recessed relative w-full overflow-hidden rounded-2xl">
          <LocationPicker
            value={coordinates}
            defaultCenter={mapCenter}
            onChange={handlePin}
            onClear={() => handleUpdate({ coordinates: undefined })}
            color={pinColor}
            className="h-64 w-full"
          />
        </div>

        <p className="mt-2 text-xs text-[#342417]/55">
          {geoLoading ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#342417]/70">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Detecting address from pin…
            </span>
          ) : coordinates ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#342417]/70">
              <MapPin className="h-3.5 w-3.5" style={{ color: "var(--nm-accent)" }} />
              {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)} · address auto-filled from pin
            </span>
          ) : (
            "Click the map to drop a pin — the address fields fill in automatically. Drag to fine-tune."
          )}
        </p>
      </div>
    </div>
  );
}
