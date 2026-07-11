"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, Trash2 } from "lucide-react";
import MapFrame from "@/components/map/MapFrame";
import { pinIcon, PIN_COLORS } from "@/components/map/markerIcons";

export interface LatLng {
  lat: number;
  lng: number;
}

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
  /** Removes the current pin (enables the fullscreen "Clear pin" control). */
  onClear?: () => void;
  className?: string;
  zoom?: number;
  /** Pin color — pass the listing accent (ember for sale, jade for rent). */
  color?: string;
}

export default function LocationPicker({
  value,
  defaultCenter,
  onChange,
  onClear,
  className = "h-64 w-full",
  zoom = 15,
  color = PIN_COLORS.sale,
}: LocationPickerProps) {
  const center = value ?? defaultCenter;

  const renderActions = (close: () => void) => (
    <>
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-[#B05B33] shadow-md transition hover:bg-white cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Clear pin
        </button>
      )}
      <button
        type="button"
        onClick={close}
        disabled={!value}
        style={{ backgroundColor: color }}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-50 cursor-pointer"
      >
        <Check className="h-4 w-4" />
        Confirm pin
      </button>
    </>
  );

  return (
    <MapFrame className={className} title="Pin exact location" renderActions={renderActions}>
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
          <ClickCapture onPick={onChange} />
          <Recenter center={defaultCenter} active={!value} />
          {value && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon(color)}
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
      )}
    </MapFrame>
  );
}
