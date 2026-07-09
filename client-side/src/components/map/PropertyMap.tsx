"use client";

import type { ReactNode } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export interface LatLng {
  lat: number;
  lng: number;
}

// Leaflet's default marker icons reference asset paths that break under bundlers;
// point them at the bundled copies once, at module load. Idempotent.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface PropertyMapProps {
  /** Where to center the map and drop the marker. */
  center: LatLng;
  zoom?: number;
  className?: string;
  /** Optional popup content shown when the marker is clicked. */
  popup?: ReactNode;
}

/** Read-only Leaflet map with a single marker — for showing a saved location. */
export default function PropertyMap({
  center,
  zoom = 15,
  className = "h-64 w-full",
  popup,
}: PropertyMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[center.lat, center.lng]}>
        {popup && <Popup>{popup}</Popup>}
      </Marker>
    </MapContainer>
  );
}
