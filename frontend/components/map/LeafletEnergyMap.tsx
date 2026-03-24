"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

type MapMode = "normal" | "dark" | "satellite";

type Point = {
  id: number;
  name: string;
  value: number;
  latitude: number;
  longitude: number;
  recordedAt: string;
};

type Props = {
  mode: MapMode;
  points: Point[];
};

const layers: Record<MapMode, { url: string; attribution: string }> = {
  normal: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors"
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri"
  }
};

export function LeafletEnergyMap({ mode, points }: Props) {
  const fallback = { latitude: -23.55052, longitude: -46.633308 };
  const center = points[0] ?? { latitude: fallback.latitude, longitude: fallback.longitude };

  return (
    <MapContainer center={[center.latitude, center.longitude]} zoom={12} scrollWheelZoom style={{ height: "420px" }}>
      <TileLayer attribution={layers[mode].attribution} url={layers[mode].url} />
      {points.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.latitude, point.longitude]}
          radius={Math.min(22, Math.max(8, point.value / 4))}
          pathOptions={{
            color: mode === "dark" ? "#c7ffe8" : "#145c45",
            fillColor: point.value > 40 ? "#e65c4f" : "#30b06f",
            fillOpacity: 0.72,
            weight: 1.4
          }}
        >
          <Popup>
            <strong>{point.name}</strong>
            <div>{point.value.toFixed(2)} kWh</div>
            <div>{new Date(point.recordedAt).toLocaleString("pt-BR")}</div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
