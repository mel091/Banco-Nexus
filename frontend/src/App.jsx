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
  const [cuenta, setCuenta] =
    useState("");

  const [datos, setDatos] =
    useState(null);

  const [historial, setHistorial] =
    useState([]);

  const [movimientos, setMovimientos] =
    useState([]);

  const [error, setError] =
    useState("");

  const [monto, setMonto] =
    useState("");

  const [mensaje, setMensaje] =
    useState({ texto: "Sistema conectado", tipo: "success" });

  const [
    mostrarConfirmacion,
    setMostrarConfirmacion,
  ] = useState(false);

  const [tipoOperacion, setTipoOperacion] =
    useState("");

  // REPLICA SET
  const [alertaReplica, setAlertaReplica] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [latencia, setLatencia] =
    useState(null);
  
  const getMensajeColor = (tipo) => {
    if (tipo === "error") return "#f87171";
    if (tipo === "success") return "#4ade80";
    return "#ccc";
  };
  
  // CONSULTAR CUENTA
  const consultarCuenta = async () => {
    if (!cuenta) {
      setMensaje({ texto: "Ingresa un número de cuenta", tipo: "error" });
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAlertaReplica("");

      const inicio = Date.now();

      const resCuenta = await fetch(
        `${API}/cuenta/${cuenta}`
      );

      const tiempoRespuesta =
        Date.now() - inicio;

      setLatencia(tiempoRespuesta);

      // DETECCIÓN DE LATENCIA
      if (tiempoRespuesta > 3000) {
        setAlertaReplica(
          "Alta latencia detectada"
        );
      }

      // DETECCIÓN DE FAILOVER - Primero verificar status 503
      if (resCuenta.status === 503) {
        const errorMsg = "⚠ Nodo primario no disponible. MongoDB Replica Set intentando recuperación.";
        setAlertaReplica(errorMsg);
        setMensaje({ texto: "Servicio temporalmente no disponible", tipo: "error" });
        throw new Error("Servicio temporalmente no disponible");
      }

      const data =
        await resCuenta.json();

      // DETECCIÓN DE FAILOVER por mensaje
      if (
        data.message ===
          "Servicio temporalmente no disponible"
      ) {
        const errorMsg = "⚠ Nodo primario no disponible. MongoDB Replica Set intentando recuperación.";
        setAlertaReplica(errorMsg);
        setMensaje({ texto: data.message, tipo: "error" });
        throw new Error(data.message);
      }

      if (!resCuenta.ok) {
        throw new Error(data.message);
      }

      setDatos(data);
      setMensaje({ texto: "Conectado", tipo: "success" });

      const transacciones =
        data.transacciones || [];

      const historialFormateado = [];

      let saldoActual = Number(
        data.saldo
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
          data.numero_cuenta
        ) {
          saldoActual += Number(
            tx.monto || 0
          );
        } else if (
          tx.cuenta_destino ===
          data.numero_cuenta
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
      // Filtrar el mensaje de error para que solo muestre "Saldo insuficiente"
      let errorMessage = err.message;
      if (errorMessage.includes("Fondos insuficientes") || errorMessage.includes("cuenta no encontrada")) {
        errorMessage = "Saldo insuficiente";
      }
      setError(errorMessage);
      setMensaje({ texto: errorMessage, tipo: "error" });
      setDatos(null);
      setHistorial([]);
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  };

  // OPERACIONES
  const realizarOperacion = async (
    tipo
  ) => {
    try {
      setMensaje({ texto: "", tipo: "" });
      setLoading(true);
      setAlertaReplica("");

      if (
        !monto ||
        Number(monto) <= 0
      ) {
        setMensaje({
          texto: "Ingresa un monto válido",
          tipo: "error"
        });
        setLoading(false);
        return;
      }

      const inicio = Date.now();

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

      const tiempoRespuesta =
        Date.now() - inicio;

      setLatencia(tiempoRespuesta);

      // LATENCIA
      if (tiempoRespuesta > 3000) {
        setAlertaReplica(
          "Replica Set con alta latencia"
        );
      }

      // FAILOVER - Primero verificar status 503
      if (res.status === 503) {
        const errorMsg = "⚠ Error de conexión con el nodo primario.";
        setAlertaReplica(errorMsg);
        setMensaje({ texto: "Servicio temporalmente no disponible", tipo: "error" });
        throw new Error("Servicio temporalmente no disponible");
      }

      const data = await res.json();

      // FAILOVER por mensaje
      if (
        data.message ===
          "Servicio temporalmente no disponible"
      ) {
        const errorMsg = "⚠ Error de conexión con el nodo primario.";
        setAlertaReplica(errorMsg);
        setMensaje({ texto: data.message, tipo: "error" });
        throw new Error(data.message);
      }

      if (!res.ok) {
        // Filtrar mensajes de error para operaciones
        let errorMessage = data.message;
        if (errorMessage && (errorMessage.includes("Fondos insuficientes") || errorMessage.includes("cuenta no encontrada"))) {
          errorMessage = "Saldo insuficiente";
        }
        throw new Error(errorMessage);
      }

      setMensaje({ texto: data.message, tipo: "success" });
      consultarCuenta();
      setMonto("");
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes("Fondos insuficientes") || errorMessage.includes("cuenta no encontrada")) {
        errorMessage = "Saldo insuficiente";
      }
      setMensaje({ texto: errorMessage, tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          Banco Nexus
        </h1>

        {/* BUSCADOR */}
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

        {/* LOADING */}
        {loading && (
          <div style={styles.loadingBox}>
            🔄 Conectando con MongoDB...
          </div>
        )}

        {/* ALERTAS */}
        {alertaReplica && (
          <div
            style={styles.alertaReplica}
          >
            {alertaReplica}
          </div>
        )}

        {/* LATENCIA */}
        {latencia && (
          <div style={styles.latencia}>
            ⏱ Tiempo de respuesta:{" "}
            {latencia} ms
          </div>
        )}

        {/* ERROR */}
        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        {datos && (
          <>
            {/* TARJETA */}
            <div style={styles.mainCard}>
              <div style={styles.topSection}>
                <div style={styles.userRow}>
                  <div style={styles.avatar}>
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
              <h2 style={styles.cardTitle}>
                Operaciones
              </h2>

              <div
                style={styles.operationBox}
              >
                <label style={styles.label}>
                  Monto:
                </label>

                <input
                  type="number"
                  value={monto}
                  onChange={(e) =>
                    setMonto(
                      e.target.value
                    )
                  }
                  style={styles.input}
                />

                <div
                  style={styles.buttonsRow}
                >
                  <button
                    style={
                      styles.depositButton
                    }
                    onClick={() => {
                      setTipoOperacion(
                        "deposito"
                      );

                      setMostrarConfirmacion(
                        true
                      );
                    }}
                  >
                    Realizar Depósito
                  </button>

                  <button
                    style={
                      styles.withdrawButton
                    }
                    onClick={() => {
                      setTipoOperacion(
                        "retiro"
                      );

                      setMostrarConfirmacion(
                        true
                      );
                    }}
                  >
                    Realizar Retiro
                  </button>
                </div>

                <p style={styles.status}>
                  <span style={{ color: getMensajeColor(mensaje.tipo) }}>
                    ● {mensaje.texto || "Sistema conectado"}
                  </span>
                </p>
              </div>
            </div>

            {/* GRAFICA */}
            {historial.length > 0 && (
              <div style={styles.card}>
                <h2
                  style={styles.cardTitle}
                >
                  Evolución del saldo
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
                          {
                            movimiento.tipo
                          }
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

            {/* MODAL */}
            {mostrarConfirmacion && (
              <div
                style={
                  styles.modalOverlay
                }
              >
                <div style={styles.modal}>
                  <h2
                    style={
                      styles.modalTitle
                    }
                  >
                    Confirmar operación
                  </h2>

                  <p
                    style={
                      styles.modalText
                    }
                  >
                    ¿Deseas realizar{" "}
                    {tipoOperacion ===
                    "deposito"
                      ? "el depósito"
                      : "el retiro"}{" "}
                    de $
                    {Number(
                      monto
                    ).toLocaleString(
                      "es-MX"
                    )}
                    ?
                  </p>

                  <div
                    style={
                      styles.modalButtons
                    }
                  >
                    <button
                      style={
                        styles.cancelButton
                      }
                      onClick={() =>
                        setMostrarConfirmacion(
                          false
                        )
                      }
                    >
                      Cancelar
                    </button>

                    <button
                      style={
                        styles.confirmButton
                      }
                      onClick={() => {
                        realizarOperacion(
                          tipoOperacion
                        );

                        setMostrarConfirmacion(
                          false
                        );
                      }}
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}
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

  loadingBox: {
    backgroundColor: "#1e1b4b",
    border: "1px solid #6366f1",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    color: "#c7d2fe",
    fontWeight: "bold",
  },

  alertaReplica: {
    backgroundColor: "#7f1d1d",
    border: "1px solid #ef4444",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    color: "#fecaca",
    fontWeight: "bold",
  },

  latencia: {
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "20px",
    color: "#d1d5db",
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
    justifyContent: "space-between",
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

  operationBox: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  label: {
    color: "#ccc",
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
  },

  online: {
    color: "#4ade80",
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
    color: "#fff",
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
    fontWeight: "bold",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor:
      "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    backgroundColor: "#111",
    border: "1px solid #7e22ce",
    borderRadius: "20px",
    padding: "30px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
  },

  modalTitle: {
    color: "#c084fc",
    marginBottom: "15px",
  },

  modalText: {
    color: "#ddd",
    marginBottom: "25px",
    fontSize: "16px",
  },

  modalButtons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },

  cancelButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#333",
    color: "white",
    cursor: "pointer",
  },

  confirmButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(90deg,#7e22ce,#a855f7)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};