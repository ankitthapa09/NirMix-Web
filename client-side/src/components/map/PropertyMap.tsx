"use client";

import type { ReactNode } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapFrame from "./MapFrame";
import { pinIcon, PIN_COLORS } from "./markerIcons";

export interface LatLng {
  lat: number;
  lng: number;
}

interface PropertyMapProps {
  /** Where to center the map and drop the marker. */
  center: LatLng;
  zoom?: number;
  className?: string;
  /** Optional popup content shown when the marker is clicked. */
  popup?: ReactNode;
  /** Pin color — pass the listing accent (ember for sale, jade for rent). */
  color?: string;
  title?: string;
}

/** Read-only Leaflet map with a single colored marker — for a saved location. */
export default function PropertyMap({
  center,
  zoom = 15,
  className = "h-64 w-full",
  popup,
  color = PIN_COLORS.sale,
  title = "Property location",
}: PropertyMapProps) {
  return (
    <MapFrame className={className} title={title}>
      {(expanded) => (
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          scrollWheelZoom={expanded}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[center.lat, center.lng]} icon={pinIcon(color)}>
            {popup && <Popup>{popup}</Popup>}
          </Marker>
        </MapContainer>
      )}
    </MapFrame>
  );
}
