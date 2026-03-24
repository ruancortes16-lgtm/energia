import { Reading } from "@/types";

type Props = {
  readings: Reading[];
};

export function ReadingsTable({ readings }: Props) {
  return (
    <section className="panel glass-card">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Historico de leituras</h2>
          <p className="panel-copy">Ultimos registros com carimbo temporal, localizacao e observacoes operacionais.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Medidor</th>
              <th>Consumo</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Observacoes</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id}>
                <td>{new Date(reading.recorded_at).toLocaleString("pt-BR")}</td>
                <td>{reading.meter_name}</td>
                <td>{reading.consumption_kwh.toFixed(2)} kWh</td>
                <td>{reading.latitude.toFixed(4)}</td>
                <td>{reading.longitude.toFixed(4)}</td>
                <td>{reading.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
