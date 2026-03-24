"use client";

import { useEffect, useState } from "react";

import { LimitsForm } from "@/components/ui/LimitsForm";
import { StatCard } from "@/components/ui/StatCard";
import { Topbar } from "@/components/ui/Topbar";
import { getDashboardOverview } from "@/lib/api";
import { DashboardOverview } from "@/types";

export default function SettingsPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  async function refresh() {
    const data = await getDashboardOverview();
    setOverview(data);
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  return (
    <main className="app-shell">
      <Topbar />
      <div className="page-grid">
        <LimitsForm onUpdated={refresh} />

        {overview ? (
          <section className="panel glass-card">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Impacto dos limites atuais</h2>
                <p className="panel-copy">Acompanhe como a configuracao dos limites conversa com o consumo recente.</p>
              </div>
            </div>

            <div className="stats-grid">
              {overview.indicators.map((indicator) => (
                <StatCard
                  key={indicator.label}
                  label={indicator.label}
                  value={indicator.value}
                  trend={indicator.trend}
                  tone={indicator.tone}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
