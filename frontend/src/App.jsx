import { useState } from "react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API =
  import.meta.env.VITE_API_URL || "/api";

export default function DashboardBancoNexus() {
  const [cuenta, setCuenta] = useState("");
  const [datos, setDatos] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const consultarCuenta = async () => {
    if (!cuenta) return;

    try {
      setError("");

      const resCuenta = await fetch(
        `${API}/cuenta/${cuenta}`
      );

      if (!resCuenta.ok) {
        throw new Error(
          "Cuenta no encontrada"
        );
      }

      const cuentaData =
        await resCuenta.json();

      setDatos(cuentaData);

      const transacciones =
        cuentaData.transacciones || [];

      const historialFormateado = [];

      let saldoActual = Number(
        cuentaData.saldo
      );

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
          saldoActual -= Number(
            tx.monto || 0
          );
        } else if (
          tx.tipo === "Retiro"
        ) {
          saldoActual += Number(
            tx.monto || 0
          );
        } else if (
          tx.cuenta_origen ===
          cuentaData.numero_cuenta
        ) {
          saldoActual += Number(
            tx.monto || 0
          );
        } else if (
          tx.cuenta_destino ===
          cuentaData.numero_cuenta
        ) {
          saldoActual -= Number(
            tx.monto || 0
          );
        }
      }

      setHistorial(
        historialFormateado.reverse()
      );

      setMovimientos(transacciones);
    } catch (err) {
      setError(err.message);

      setDatos(null);
      setHistorial([]);
      setMovimientos([]);
    }
  };

  const realizarOperacion = async (
    tipo
  ) => {
    try {
      setMensaje("");

      if (
        !monto ||
        Number(monto) <= 0
      ) {
        setMensaje(
          "Ingresa un monto válido"
        );
        return;
      }

      const endpoint =
        tipo === "deposito"
          ? "/deposito"
          : "/retiro";

      const res = await fetch(
        `${API}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            cuenta,
            monto: Number(monto),
            sucursal: "CDMX",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setMensaje(data.message);

      consultarCuenta();

      setMonto("");
    } catch (err) {
      setMensaje(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          Banco Nexus
        </h1>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Número de cuenta"
            value={cuenta}
            onChange={(e) =>
              setCuenta(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
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
          <p style={styles.error}>
            {error}
          </p>
        )}

        {datos && (
          <>
            {/* TARJETA PRINCIPAL */}
            <div style={styles.mainCard}>
              <div style={styles.topSection}>
                <div style={styles.userRow}>
                  <div
                    style={styles.avatar}
                  >
                    👤
                  </div>

                  <div>
                    <h2
                      style={
                        styles.clientName
                      }
                    >
                      {datos.cliente}
                    </h2>

                    <p
                      style={
                        styles.accountText
                      }
                    >
                      Cuenta:{" "}
                      {
                        datos.numero_cuenta
                      }
                    </p>
                  </div>
                </div>

                <div
                  style={
                    styles.balanceContainer
                  }
                >
                  <h1
                    style={styles.balance}
                  >
                    $
                    {Number(
                      datos.saldo
                    ).toLocaleString(
                      "es-MX"
                    )}
                  </h1>

                  <p
                    style={
                      styles.balanceLabel
                    }
                  >
                    Saldo Actual
                  </p>
                </div>
              </div>
            </div>

            {/* OPERACIONES */}
            <div style={styles.card}>
              <h2
                style={styles.cardTitle}
              >
                Operaciones
              </h2>

              <div
                style={
                  styles.operationBox
                }
              >
                <label
                  style={styles.label}
                >
                  Monto:
                </label>

                <input
                  type="number"
                  placeholder="1500"
                  value={monto}
                  onChange={(e) =>
                    setMonto(
                      e.target.value
                    )
                  }
                  style={styles.input}
                />

                <div
                  style={
                    styles.buttonsRow
                  }
                >
                  <button
                    style={
                      styles.depositButton
                    }
                    onClick={() =>
                      realizarOperacion(
                        "deposito"
                      )
                    }
                  >
                    Realizar
                    Depósito
                  </button>

                  <button
                    style={
                      styles.withdrawButton
                    }
                    onClick={() =>
                      realizarOperacion(
                        "retiro"
                      )
                    }
                  >
                    Realizar
                    Retiro
                  </button>
                </div>

                <p style={styles.status}>
              
                  <span
                    style={
                      styles.online
                    }
                  >
                    {" "}
                    ●{" "}
                    {mensaje ||
                      "Conectado correctamente"}
                  </span>
                </p>
              </div>
            </div>

            {/* GRÁFICA */}
            {historial.length > 0 && (
              <div style={styles.card}>
                <h2
                  style={styles.cardTitle}
                >
                  Evolución del
                  saldo
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <LineChart
                    data={historial}
                  >
                    <CartesianGrid
                      stroke="#333"
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="fecha"
                      tick={{
                        fill: "#ccc",
                      }}
                    />

                    <YAxis
                      tick={{
                        fill: "#ccc",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          "#111",
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
                      dot={{
                        fill: "#c084fc",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* TABLA */}
            <div style={styles.card}>
              <h2
                style={styles.cardTitle}
              >
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
                      Sucursal
                    </th>

                    <th style={styles.th}>
                      Concepto
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {movimientos.map(
                    (
                      movimiento,
                      index
                    ) => (
                      <tr key={index}>
                        <td
                          style={styles.td}
                        >
                          {new Date(
                            movimiento.fecha_hora ||
                              movimiento.fecha
                          ).toLocaleDateString()}
                        </td>

                        <td
                          style={styles.td}
                        >
                          {movimiento.tipo}
                        </td>

                        <td
                          style={styles.td}
                        >
                          $
                          {Number(
                            movimiento.monto
                          ).toLocaleString(
                            "es-MX"
                          )}
                        </td>

                        <td
                          style={styles.td}
                        >
                          <span
                            style={
                              styles.badge
                            }
                          >
                            {movimiento.sucursal ||
                              "CDMX"}
                          </span>
                        </td>

                        <td
                          style={styles.td}
                        >
                          {movimiento.descripcion ||
                            "-"}
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

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },

  title: {
    textAlign: "center",
    color: "#a855f7",
    marginBottom: "30px",
    fontSize: "40px",
    fontWeight: "bold",
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
    outline: "none",
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

  topSection: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },

  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
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

  operationBox: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  label: {
    color: "#ccc",
    fontSize: "15px",
  },

  buttonsRow: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  depositButton: {
    padding: "14px 30px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(90deg,#7e22ce,#a855f7)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "250px",
    fontSize: "16px",
  },

  withdrawButton: {
    padding: "14px 30px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(90deg,#6b21a8,#9333ea)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "250px",
    fontSize: "16px",
  },

  status: {
    textAlign: "center",
    color: "#ccc",
    marginTop: "10px",
  },

  online: {
    color: "#4ade80",
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
    fontSize: "22px",
    fontWeight: "bold",
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

  badge: {
    backgroundColor: "#2e0255",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    display: "inline-block",
  },

  error: {
    color: "#f87171",
    marginBottom: "20px",
  },
};