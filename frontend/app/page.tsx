"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, CloudSun, Gauge, Radar } from "lucide-react";

import { ConsumptionChart } from "@/components/charts/ConsumptionChart";
import { InteractiveEnergyMap } from "@/components/map/InteractiveEnergyMap";
import { AlertsPanel } from "@/components/ui/AlertsPanel";
import { LimitsForm } from "@/components/ui/LimitsForm";
import { PeakList } from "@/components/ui/PeakList";
import { ReadingForm } from "@/components/ui/ReadingForm";
import { ReadingsTable } from "@/components/ui/ReadingsTable";
import { StatCard } from "@/components/ui/StatCard";
import { Topbar } from "@/components/ui/Topbar";
import { getAlerts, getDashboardOverview, getReadings } from "@/lib/api";
import { Alert, DashboardOverview, Reading } from "@/types";

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [overviewData, readingsData, alertsData] = await Promise.all([
        getDashboardOverview(),
        getReadings(80),
        getAlerts(8)
      ]);
      setOverview(overviewData);
      setReadings(readingsData);
      setAlerts(alertsData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData().catch(() => setLoading(false));
  }, []);

  return (
    <main className="app-shell">
      <Topbar />

      {loading || !overview ? (
        <section className="panel glass-card">
          <p className="panel-copy">Carregando painel do EnergIA...</p>
        </section>
      ) : (
        <div className="page-grid">
          <section className="hero-grid">
            <div className="panel panel-dark">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Panorama energetico</h2>
                  <p className="panel-copy">
                    Visibilidade central sobre consumo diario, semanal e mensal, com base pronta para previsao climatica e IA.
                  </p>
                </div>
                <span className="badge low">Operacao ativa</span>
              </div>

              <div className="stats-grid">
                <StatCard
                  label="Consumo diario"
                  value={`${overview.daily_consumption.toFixed(1)} kWh`}
                  trend="Atualizado em tempo real"
                  tone="positive"
                  dark
                />
                <StatCard
                  label="Consumo semanal"
                  value={`${overview.weekly_consumption.toFixed(1)} kWh`}
                  trend="Consolidado nos ultimos 7 dias"
                  tone="neutral"
                  dark
                />
                <StatCard
                  label="Consumo mensal"
                  value={`${overview.monthly_consumption.toFixed(1)} kWh`}
                  trend="Acumulado do mes"
                  tone="neutral"
                  dark
                />
                <StatCard
                  label="Alertas ativos"
                  value={`${overview.active_alerts}`}
                  trend="Disparos automaticos"
                  tone={overview.active_alerts > 0 ? "warning" : "positive"}
                  dark
                />
              </div>
            </div>

            <div className="panel glass-card">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Pronto para expansao</h2>
                  <p className="panel-copy">Arquitetura preparada para enriquecer o monitoramento com camadas inteligentes.</p>
                </div>
              </div>

              <div className="info-grid">
                <div className="soft-card">
                  <CloudSun size={24} />
                  <strong>Previsao do tempo</strong>
                  <span className="muted">Reservado para cruzar clima com padroes de demanda e consumo.</span>
                </div>
                <div className="soft-card">
                  <BrainCircuit size={24} />
                  <strong>IA aplicada</strong>
                  <span className="muted">Camada futura para anomalias, previsao e recomendacoes operacionais.</span>
                </div>
                <div className="soft-card">
                  <Radar size={24} />
                  <strong>Alertas inteligentes</strong>
                  <span className="muted">Base pronta para notificacoes mais sofisticadas por evento e contexto.</span>
                </div>
                <div className="soft-card">
                  <Gauge size={24} />
                  <strong>Escalabilidade</strong>
                  <span className="muted">Separacao por rotas, servicos e componentes para crescimento sustentavel.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="content-grid">
            <div className="panel glass-card">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Evolucao do consumo</h2>
                  <p className="panel-copy">Curva agregada dos ultimos 30 dias para localizar tendencia de aumento e sazonalidade.</p>
                </div>
              </div>
              <ConsumptionChart data={overview.chart} />
            </div>

            <PeakList peaks={overview.peaks} />
          </section>

          <section className="content-grid">
            <ReadingForm onCreated={loadData} />
            <LimitsForm onUpdated={loadData} />
          </section>

          <section className="bottom-grid">
            <AlertsPanel alerts={alerts} />
            <InteractiveEnergyMap readings={readings} />
          </section>

          <ReadingsTable readings={readings} />

          <section className="panel glass-card">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Indicadores resumidos</h2>
                <p className="panel-copy">Leitura rapida da aderencia as metas configuradas no sistema.</p>
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
        </div>
      )}
    </main>
  );
}
