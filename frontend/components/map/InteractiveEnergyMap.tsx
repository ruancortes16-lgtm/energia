"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { Reading } from "@/types";

const DynamicMap = dynamic(() => import("./LeafletEnergyMap").then((mod) => mod.LeafletEnergyMap), {
  ssr: false
});

type MapMode = "normal" | "dark" | "satellite";

const modes: { value: MapMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "dark", label: "Escuro" },
  { value: "satellite", label: "Satelite" }
];

type Props = {
  readings: Reading[];
};

export function InteractiveEnergyMap({ readings }: Props) {
  const [mode, setMode] = useState<MapMode>("normal");

  const points = useMemo(
    () =>
      readings.slice(0, 40).map((reading) => ({
        id: reading.id,
        name: reading.meter_name,
        value: reading.consumption_kwh,
        latitude: reading.latitude,
        longitude: reading.longitude,
        recordedAt: reading.recorded_at
      })),
    [readings]
  );

  return (
    <div className="panel panel-dark">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Mapa operacional</h2>
          <p className="panel-copy">
            Visualize a distribuicao geografica das leituras com troca de camada entre mapa padrao, tema escuro e satelite.
          </p>
        </div>
        <div className="map-toolbar">
          {modes.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`map-button ${mode === item.value ? "active" : ""}`}
              onClick={() => setMode(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="map-frame">
        <DynamicMap mode={mode} points={points} />
      </div>
    </div>
  );
}
