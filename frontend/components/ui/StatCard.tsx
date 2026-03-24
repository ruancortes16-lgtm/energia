type Props = {
  label: string;
  value: string;
  trend: string;
  tone: "positive" | "warning" | "critical" | "neutral";
  dark?: boolean;
};

export function StatCard({ label, value, trend, tone, dark = false }: Props) {
  return (
    <article className={`stat-card ${dark ? "dark" : ""}`}>
      <span className="stat-label">{label}</span>
      <div className="stat-value">{value}</div>
      <div className={`stat-trend trend-${tone}`}>{trend}</div>
    </article>
  );
}
