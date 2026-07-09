"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export interface LatLng {
  lat: number;
  lng: number;
}


L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

const round = (n: number) => Math.round(n * 1e6) / 1e6;

/** Places a pin wherever the user clicks the map. */
function ClickCapture({ onPick }: { onPick: (coords: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: round(e.latlng.lat), lng: round(e.latlng.lng) });
    },
  });
  return null;
}

// Recenters the map when the desired center changes but no pin is placed yet
// (e.g. the user picks a different district before dropping a pin).
function Recenter({ center, active }: { center: LatLng; active: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (active) map.setView([center.lat, center.lng]);
  }, [center.lat, center.lng, active, map]);
  return null;
}

interface LocationPickerProps {
  /** Current pin, if the user has dropped one. */
  value?: LatLng;
  /** Where to center the map before a pin exists. */
  defaultCenter: LatLng;
  onChange: (coords: LatLng) => void;
  className?: string;
  zoom?: number;
}

export default function LocationPicker({
  value,
  defaultCenter,
  onChange,
  className = "h-64 w-full",
  zoom = 15,
}: LocationPickerProps) {
  const center = value ?? defaultCenter;

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
      <ClickCapture onPick={onChange} />
      <Recenter center={defaultCenter} active={!value} />
      {value && (
        <Marker
          position={[value.lat, value.lng]}
          draggable
          eventHandlers={{
            dragend(e) {
              const p = (e.target as L.Marker).getLatLng();
              onChange({ lat: round(p.lat), lng: round(p.lng) });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
