import { useState } from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,} from "recharts";

const API = import.meta.env.VITE_API_URL || "/api";

export default function DashboardBancoNexus() {
  const [cuenta, setCuenta] = useState("");
  const [datos, setDatos] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  const consultarCuenta = async () => {
    if (!cuenta) return;

    try {
      setError("");

      const resCuenta = await fetch(
        `${API}/cuenta/${cuenta}`
      );

      if (!resCuenta.ok) {
        throw new Error("Cuenta no encontrada");
      }

      const cuentaData = await resCuenta.json();

      setDatos(cuentaData);

      const transacciones =
        cuentaData.transacciones || [];

      const historialFormateado = [];
      let saldoActual = Number(cuentaData.saldo);

      for (const tx of transacciones) {
        historialFormateado.push({
          fecha: new Date(
            tx.fecha_hora || tx.fecha
          ).toLocaleDateString(),
          saldo: saldoActual,
        });

        if (
          tx.tipo === "Deposito" ||
          tx.tipo === "Depósito"
        ) {
          saldoActual -= Number(tx.monto || 0);
        } else if (tx.tipo === "Retiro") {
          saldoActual += Number(tx.monto || 0);
        } else if (
          tx.cuenta_origen === cuentaData.numero_cuenta
        ) {
          saldoActual += Number(tx.monto || 0);
        } else if (
          tx.cuenta_destino === cuentaData.numero_cuenta
        ) {
          saldoActual -= Number(tx.monto || 0);
        }
      }

      setHistorial(historialFormateado.reverse());

      setMovimientos(transacciones);
    } catch (err) {
      setError(err.message);
      setDatos(null);
      setHistorial([]);
      setMovimientos([]);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Banco Nexus</h1>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Número de cuenta"
          value={cuenta}
          onChange={(e) =>
            setCuenta(
              e.target.value.replace(/\D/g, "")
            )
          }
          style={styles.input}
        />

        <button
          onClick={consultarCuenta}
          style={styles.button}
        >
          Consultar
        </button>
      </div>

      {error && (
        <p style={styles.error}>{error}</p>
      )}

      {datos && (
        <>
          <div style={styles.mainCard}>
            <div style={styles.userRow}>
              <div style={styles.avatar}>👤</div>

              <div>
                <h2 style={styles.clientName}>
                  {datos.cliente}
                </h2>

                <p style={styles.accountText}>
                  Cuenta: {datos.numero_cuenta}
                </p>
              </div>
            </div>

            <div style={styles.balanceContainer}>
              <h1 style={styles.balance}>
                $
                {Number(datos.saldo).toLocaleString(
                  "es-MX"
                )}
              </h1>

              <p style={styles.balanceLabel}>
                Saldo Actual
              </p>
            </div>
          </div>

          {historial.length > 0 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                Evolución del saldo
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <LineChart data={historial}>
                  <CartesianGrid
                    stroke="#333"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="fecha"
                    tick={{ fill: "#ccc" }}
                  />

                  <YAxis
                    tick={{ fill: "#ccc" }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border:
                        "1px solid #7e22ce",
                      color: "#fff",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="saldo"
                    stroke="#a855f7"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Movimientos
            </h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    Fecha
                  </th>

                  <th style={styles.th}>
                    Tipo
                  </th>

                  <th style={styles.th}>
                    Monto
                  </th>

                  <th style={styles.th}>
                    Concepto
                  </th>
                </tr>
              </thead>

              <tbody>
                {movimientos.map(
                  (movimiento, index) => (
                    <tr key={index}>
                      <td style={styles.td}>
                        {new Date(
                          movimiento.fecha_hora ||
                            movimiento.fecha
                        ).toLocaleDateString()}
                      </td>

                      <td style={styles.td}>
                        {movimiento.tipo}
                      </td>

                      <td style={styles.td}>
                        $
                        {Number(
                          movimiento.monto
                        ).toLocaleString(
                          "es-MX"
                        )}
                      </td>

                      <td style={styles.td}>
                        {movimiento.descripcion || "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#050505",
    color: "white",
    padding: "30px",
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
    color: "#a855f7",
    marginBottom: "30px",
    fontSize: "40px",
  },

  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: "220px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #7e22ce",
    backgroundColor: "#111",
    color: "white",
    fontSize: "16px",
  },

  button: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#7e22ce",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  mainCard: {
    backgroundColor: "#111",
    border: "1px solid #7e22ce",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "25px",
  },

  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#2e0255",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  },

  clientName: {
    margin: 0,
    fontSize: "28px",
  },

  accountText: {
    color: "#ccc",
  },

  balanceContainer: {
    textAlign: "center",
  },

  balance: {
    fontSize: "60px",
    margin: 0,
    color: "#c084fc",
  },

  balanceLabel: {
    color: "#ccc",
    fontSize: "20px",
  },

  card: {
    backgroundColor: "#111",
    border: "1px solid #7e22ce",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "25px",
    overflowX: "auto",
  },

  cardTitle: {
    marginBottom: "20px",
    color: "#c084fc",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "12px",
    borderBottom: "1px solid #333",
    textAlign: "left",
    color: "#c084fc",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #222",
    color: "#ffffff",
  },

  error: {
    color: "#f87171",
    marginBottom: "20px",
  },
};