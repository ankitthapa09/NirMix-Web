"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { Property } from "@/types/property";

// Leaflet's default marker icons reference asset paths that break under bundlers;
// point them at the bundled copies once, at module load. Idempotent.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

type PinnedProperty = Property & { coordinates: { lat: number; lng: number } };

const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

// Compact price for the marker popup, mirroring DashboardPropertyCard.
function formatPrice(price: number, status: string): string {
  if (status === "For Rent") return `NPR ${price.toLocaleString("en-IN")}/mo`;
  if (price >= 1e7) return `NPR ${(price / 1e7).toFixed(price % 1e7 === 0 ? 0 : 2)} Cr`;
  if (price >= 1e5) return `NPR ${(price / 1e5).toFixed(price % 1e5 === 0 ? 0 : 2)} Lakh`;
  return `NPR ${price.toLocaleString("en-IN")}`;
}

/** Fits the viewport to all markers whenever the set of points changes. */
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [points, map]);
  return null;
}

interface PropertiesMapProps {
  properties: Property[];
  className?: string;
}

/** Browse-view map: a marker per pinned listing, each linking to its detail page. */
export default function PropertiesMap({
  properties,
  className = "h-[600px] w-full",
}: PropertiesMapProps) {
  const pinned = useMemo(
    () => properties.filter((p): p is PinnedProperty => !!p.coordinates),
    [properties]
  );
  const points = useMemo<[number, number][]>(
    () => pinned.map((p) => [p.coordinates.lat, p.coordinates.lng]),
    [pinned]
  );

  return (
    <MapContainer center={NEPAL_CENTER} zoom={7} scrollWheelZoom className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {pinned.map((p) => (
        <Marker key={p.id} position={[p.coordinates.lat, p.coordinates.lng]}>
          <Popup>
            <div className="w-44">
              {p.photos[0] && (
                <img
                  src={p.photos[0]}
                  alt={p.title}
                  className="mb-2 h-24 w-full rounded object-cover"
                />
              )}
              <p className="text-sm font-bold text-[#342417]">
                {formatPrice(p.price, p.status)}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-[#5C4D3C]">{p.title}</p>
              <p className="mt-0.5 text-[11px] text-[#5C4D3C]/70">
                {[p.location.neighborhood, p.location.city].filter(Boolean).join(", ")}
              </p>
              <Link
                href={`/properties/${p.id}`}
                className="mt-1.5 inline-block text-xs font-bold text-[#B05B33] hover:underline"
              >
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
