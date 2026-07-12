export interface GeocodedAddress {
  province?: string;
  district?: string;
  city?: string;
  ward?: string;
  area?: string;
  landmark?: string;
}

// Subset of OpenStreetMap Nominatim's `address` object relevant to Nepal.
interface NominatimAddress {
  state?: string;
  region?: string;
  state_district?: string;
  county?: string;
  district?: string;
  city?: string;
  city_district?: string;
  town?: string;
  municipality?: string;
  village?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  ward?: string;
  road?: string;
  amenity?: string;
  building?: string;
}

// Nepal local units embed the ward as a "-<n>" suffix, e.g. "Budhanilkantha-12".
const wardFrom = (...values: (string | undefined)[]): string | undefined => {
  for (const v of values) {
    const m = v?.match(/-\s*(\d{1,2})(?:\D|$)/);
    if (m) return m[1];
  }
  return undefined;
};


// Reverse geocode coordinates into Nepali address parts via OpenStreetMap

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedAddress | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=en&lat=${lat}&lon=${lng}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;

    const data = (await res.json()) as { address?: NominatimAddress; display_name?: string };
    const a = data.address;
    if (!a) return null;

    return {
      province: a.state ?? a.region,
      district: a.state_district ?? a.district ?? a.county,
      city: a.city ?? a.town ?? a.municipality ?? a.village,
      ward: wardFrom(a.city_district, data.display_name),
      area: a.suburb ?? a.neighbourhood ?? a.quarter,
      landmark: a.road ?? a.amenity ?? a.building,
    };
  } catch {
    return null;
  }
}

export interface GeoSearchResult {
  lat: number;
  lng: number;
  label: string;
}


// Forward-geocode a free-text query to Nepal places via Nominatim search

export async function searchPlaces(query: string, limit = 6): Promise<GeoSearchResult[]> {
  const q = query.trim();
  if (!q) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=np&accept-language=en&limit=${limit}&q=${encodeURIComponent(q)}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return [];

    const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
    return data
      .map((d) => ({ lat: Number(d.lat), lng: Number(d.lon), label: d.display_name }))
      .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng));
  } catch {
    return [];
  }
}
