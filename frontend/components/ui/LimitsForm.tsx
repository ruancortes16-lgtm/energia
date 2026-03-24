"use client";

import { FormEvent, useEffect, useState } from "react";

import { getLimits, updateLimits } from "@/lib/api";
import { LimitsPayload } from "@/types";

type Props = {
  onUpdated?: () => Promise<void>;
};

export function LimitsForm({ onUpdated }: Props) {
  const [form, setForm] = useState<LimitsPayload>({
    daily_limit_kwh: 120,
    weekly_limit_kwh: 780,
    monthly_limit_kwh: 3200,
    peak_threshold_multiplier: 1.35
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getLimits()
      .then((limits) => {
        setForm({
          daily_limit_kwh: limits.daily_limit_kwh,
          weekly_limit_kwh: limits.weekly_limit_kwh,
          monthly_limit_kwh: limits.monthly_limit_kwh,
          peak_threshold_multiplier: limits.peak_threshold_multiplier
        });
      })
      .catch(() => undefined);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await updateLimits(form);
      setMessage("Limites atualizados com sucesso.");
      if (onUpdated) {
        await onUpdated();
      }
    } catch {
      setMessage("Nao foi possivel atualizar os limites.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel glass-card">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Limites de consumo</h2>
          <p className="panel-copy">Ajuste as metas que alimentam a geracao automatica de alertas e a classificacao de risco.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-grid two-col">
          <div className="field">
            <label htmlFor="daily_limit_kwh">Limite diario (kWh)</label>
            <input
              id="daily_limit_kwh"
              type="number"
              min="1"
              step="0.01"
              value={form.daily_limit_kwh}
              onChange={(event) => setForm((current) => ({ ...current, daily_limit_kwh: Number(event.target.value) }))}
            />
          </div>

          <div className="field">
            <label htmlFor="weekly_limit_kwh">Limite semanal (kWh)</label>
            <input
              id="weekly_limit_kwh"
              type="number"
              min="1"
              step="0.01"
              value={form.weekly_limit_kwh}
              onChange={(event) => setForm((current) => ({ ...current, weekly_limit_kwh: Number(event.target.value) }))}
            />
          </div>
        </div>

        <div className="form-grid two-col">
          <div className="field">
            <label htmlFor="monthly_limit_kwh">Limite mensal (kWh)</label>
            <input
              id="monthly_limit_kwh"
              type="number"
              min="1"
              step="0.01"
              value={form.monthly_limit_kwh}
              onChange={(event) => setForm((current) => ({ ...current, monthly_limit_kwh: Number(event.target.value) }))}
            />
          </div>

          <div className="field">
            <label htmlFor="peak_threshold_multiplier">Multiplicador de pico</label>
            <input
              id="peak_threshold_multiplier"
              type="number"
              min="1.01"
              max="5"
              step="0.01"
              value={form.peak_threshold_multiplier}
              onChange={(event) =>
                setForm((current) => ({ ...current, peak_threshold_multiplier: Number(event.target.value) }))
              }
            />
          </div>
        </div>

        <div className="status-line">
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Salvando..." : "Salvar limites"}
          </button>
          {message ? <span>{message}</span> : null}
        </div>
      </form>
    </section>
  );
}
