export interface GeocodedAddress {
  province?: string;
  district?: string;
  city?: string;
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


// Reverse geocode coordinates into Nepali address parts via OpenStreetMap

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedAddress | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=en&lat=${lat}&lon=${lng}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;

    const data = (await res.json()) as { address?: NominatimAddress };
    const a = data.address;
    if (!a) return null;

    return {
      province: a.state ?? a.region,
      district: a.state_district ?? a.district ?? a.county,
      city: a.city ?? a.town ?? a.municipality ?? a.village,
      area: a.suburb ?? a.neighbourhood ?? a.quarter ?? a.ward,
      landmark: a.road ?? a.amenity ?? a.building,
    };
  } catch {
    return null;
  }
}
