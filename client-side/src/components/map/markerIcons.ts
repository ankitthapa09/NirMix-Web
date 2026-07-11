import L from "leaflet";

// Accent pins keyed to listing intent, matching the app's ember/jade tokens.
export const PIN_COLORS = {
  sale: "#B05B33", // ember — For Sale
  rent: "#157A74", // jade — For Rent
  neutral: "#342417", // ink — fallback
} as const;

/** Pin color for a listing status string ("For Sale" / "For Rent"). */
export function colorForStatus(status: string): string {
  return status === "For Rent" ? PIN_COLORS.rent : PIN_COLORS.sale;
}

/**
 * A colored teardrop marker rendered as an inline-SVG divIcon — no image
 * assets, so it can't break under the bundler and can be any color.
 */
export function pinIcon(color: string): L.DivIcon {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40" style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.35))">
  <path d="M14 0C6.27 0 0 6.27 0 14c0 9.88 12.28 24.7 12.8 25.32a1.56 1.56 0 0 0 2.4 0C15.72 38.7 28 23.88 28 14 28 6.27 21.73 0 14 0z" fill="${color}"/>
  <circle cx="14" cy="14" r="5.2" fill="#ffffff"/>
</svg>`.trim();

  // A custom className replaces Leaflet's default ".leaflet-div-icon" white box.
  return L.divIcon({
    html: svg,
    className: "nm-pin",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -36],
  });
}
