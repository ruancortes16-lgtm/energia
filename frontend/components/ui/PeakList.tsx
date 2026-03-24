import { Peak } from "@/types";

type Props = {
  peaks: Peak[];
};

export function PeakList({ peaks }: Props) {
  return (
    <section className="panel glass-card">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Picos identificados</h2>
          <p className="panel-copy">Leituras fora do padrao recente para agir antes de virar custo desnecessario.</p>
        </div>
      </div>

      <div className="peak-list">
        {peaks.map((peak) => (
          <article key={peak.id} className="peak-item">
            <span className={`badge ${peak.severity}`}>{peak.severity}</span>
            <strong>{peak.meter_name}</strong>
            <div>{peak.consumption_kwh.toFixed(2)} kWh</div>
            <div className="muted">{new Date(peak.recorded_at).toLocaleString("pt-BR")}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
