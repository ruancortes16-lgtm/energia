"use client";

import { FormEvent, useState } from "react";

import { createReading } from "@/lib/api";
import { ReadingPayload } from "@/types";

type Props = {
  onCreated: () => Promise<void>;
};

const initialState: ReadingPayload = {
  meter_name: "Medidor Principal",
  consumption_kwh: 24,
  recorded_at: new Date().toISOString().slice(0, 16),
  latitude: -23.55052,
  longitude: -46.633308,
  notes: ""
};

export function ReadingForm({ onCreated }: Props) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await createReading({
        ...form,
        consumption_kwh: Number(form.consumption_kwh),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        recorded_at: new Date(form.recorded_at).toISOString()
      });
      setMessage("Leitura registrada com sucesso.");
      setForm({ ...initialState, recorded_at: new Date().toISOString().slice(0, 16) });
      await onCreated();
    } catch {
      setMessage("Nao foi possivel registrar a leitura.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel glass-card">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Registrar nova leitura</h2>
          <p className="panel-copy">Inclua o consumo identificado para alimentar os graficos, os alertas e a analise de picos.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-grid two-col">
          <div className="field">
            <label htmlFor="meter_name">Medidor</label>
            <input
              id="meter_name"
              value={form.meter_name}
              onChange={(event) => setForm((current) => ({ ...current, meter_name: event.target.value }))}
            />
          </div>

          <div className="field">
            <label htmlFor="consumption_kwh">Consumo (kWh)</label>
            <input
              id="consumption_kwh"
              type="number"
              min="0"
              step="0.01"
              value={form.consumption_kwh}
              onChange={(event) => setForm((current) => ({ ...current, consumption_kwh: Number(event.target.value) }))}
            />
          </div>
        </div>

        <div className="form-grid two-col">
          <div className="field">
            <label htmlFor="recorded_at">Data e hora</label>
            <input
              id="recorded_at"
              type="datetime-local"
              value={form.recorded_at}
              onChange={(event) => setForm((current) => ({ ...current, recorded_at: event.target.value }))}
            />
          </div>

          <div className="field">
            <label htmlFor="notes">Observacoes</label>
            <input
              id="notes"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            />
          </div>
        </div>

        <div className="form-grid two-col">
          <div className="field">
            <label htmlFor="latitude">Latitude</label>
            <input
              id="latitude"
              type="number"
              step="0.000001"
              value={form.latitude}
              onChange={(event) => setForm((current) => ({ ...current, latitude: Number(event.target.value) }))}
            />
          </div>

          <div className="field">
            <label htmlFor="longitude">Longitude</label>
            <input
              id="longitude"
              type="number"
              step="0.000001"
              value={form.longitude}
              onChange={(event) => setForm((current) => ({ ...current, longitude: Number(event.target.value) }))}
            />
          </div>
        </div>

        <div className="status-line">
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Salvando..." : "Registrar leitura"}
          </button>
          {message ? <span>{message}</span> : null}
        </div>
      </form>
    </section>
  );
}
