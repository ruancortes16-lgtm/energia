import { Alert } from "@/types";

type Props = {
  alerts: Alert[];
};

export function AlertsPanel({ alerts }: Props) {
  return (
    <section className="panel glass-card">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Alertas automaticos</h2>
          <p className="panel-copy">Eventos recentes disparados quando limites sao excedidos ou quando picos sao detectados.</p>
        </div>
      </div>

      <div className="alert-list">
        {alerts.map((alert) => (
          <article key={alert.id} className="alert-item">
            <span className={`badge ${alert.severity}`}>{alert.severity}</span>
            <strong>{alert.title}</strong>
            <p className="muted">{alert.description}</p>
            <div className="status-line">
              <span>{new Date(alert.triggered_at).toLocaleString("pt-BR")}</span>
              <span>{alert.type}</span>
            </div>
          </article>
        ))}
        {alerts.length === 0 ? <p className="muted">Nenhum alerta ativo no momento.</p> : null}
      </div>
    </section>
  );
}
