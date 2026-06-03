import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "../styles/styles";
import Campo from "./Campo";
import { fmt, fmtFecha, getMensajeColor, MOVIMIENTOS_MOCK } from "../helpers";

export default function Dashboard({
  usuario,
  setUsuario,
  showToast,
}) {
  const [movimientos, setMovimientos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [monto, setMonto] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({
    texto: "Sistema conectado",
    tipo: "success",
  });
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [tipoOperacion, setTipoOperacion] = useState("");

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = () => {
    setMovimientos(MOVIMIENTOS_MOCK);
    buildHistorial(MOVIMIENTOS_MOCK);
  };

  const buildHistorial = (txs) => {
    let sal = Number(usuario?.saldo || 0);
    const hist = [];

    for (const tx of txs) {
      hist.push({
        fecha: new Date(
          tx.fecha_hora || tx.fecha
        ).toLocaleDateString("es-MX"),
        saldo: sal,
      });

      if (tx.tipo === "Depósito" || tx.tipo === "Deposito") {
        sal -= Number(tx.monto || 0);
      } else if (tx.tipo === "Retiro") {
        sal += Number(tx.monto || 0);
      } else if (tx.cuenta_origen === usuario?.numero_cuenta) {
        sal += Number(tx.monto || 0);
      } else {
        sal -= Number(tx.monto || 0);
      }
    }

    setHistorial(hist.reverse());
  };

  const realizarOperacion = async (tipo) => {
    if (!monto || Number(monto) <= 0) {
      setMensaje({ texto: "Ingresa un monto válido", tipo: "error" });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const nuevoSaldo =
        tipo === "deposito"
          ? Number(usuario.saldo) + Number(monto)
          : Number(usuario.saldo) - Number(monto);

      if (tipo === "retiro" && nuevoSaldo < 0) {
        setMensaje({ texto: "Saldo insuficiente", tipo: "error" });
        showToast("Saldo insuficiente", "error");
        setLoading(false);
        return;
      }

      setUsuario({
        ...usuario,
        saldo: nuevoSaldo,
      });

      setMensaje({
        texto: "Operación exitosa",
        tipo: "success",
      });

      showToast("Operación exitosa");
      setMonto("");
      setLoading(false);
    }, 600);
  };

  return (
    <>
      <div style={styles.seccionHeader}>
        <h1 style={styles.seccionTitulo}>Dashboard</h1>
        <p style={styles.seccionSub}>Resumen de tu cuenta</p>
      </div>

      <div style={styles.mainCard}>
        <div style={styles.topSection}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>👤</div>

            <div>
              <h2 style={styles.clientName}>
                {usuario?.nombre || usuario?.cliente}
              </h2>

              <p style={styles.accountText}>
                Cuenta:{" "}
                <strong style={{ color: "#c084fc" }}>
                  {usuario?.numero_cuenta}
                </strong>
              </p>
            </div>
          </div>

          <div style={styles.balanceContainer}>
            <p style={styles.balanceLabel}>Saldo disponible</p>

            <h1 style={styles.balance}>
              ${fmt(usuario?.saldo ?? 0)}
            </h1>
          </div>
        </div>
      </div>

      {historial.length > 0 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Evolución del saldo</h2>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={historial}>
              <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" />

              <XAxis
                dataKey="fecha"
                tick={{ fill: "#555", fontSize: 11 }}
              />

              <YAxis
                tick={{ fill: "#555", fontSize: 11 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #7e22ce",
                  color: "#fff",
                }}
              />

              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ fill: "#c084fc", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Historial de movimientos</h2>

        {movimientos.length === 0 ? (
          <p style={styles.sinDatos}>Sin movimientos registrados</p>
        ) : (
          <div style={styles.tableContainer}>
              <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Monto</th>
                  <th style={styles.th}>Origen</th>
                  <th style={styles.th}>Destino</th>
                  <th style={styles.th}>Concepto</th>
                </tr>
              </thead>

              <tbody>
                {movimientos.map((mv, i) => {
                  const esAbono =
                    mv.cuenta_destino === usuario?.numero_cuenta ||
                    mv.tipo === "Deposito" ||
                    mv.tipo === "Depósito";

                  return (
                    <tr key={i}>
                      <td style={styles.td}>
                        {fmtFecha(mv.fecha_hora || mv.fecha)}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: esAbono
                              ? "#14532d"
                              : "#450a0a",
                            color: esAbono
                              ? "#4ade80"
                              : "#f87171",
                          }}
                        >
                          {mv.tipo || (esAbono ? "Abono" : "Cargo")}
                        </span>
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          color: esAbono
                            ? "#4ade80"
                            : "#f87171",
                          fontWeight: "bold",
                        }}
                      >
                        {esAbono ? "+" : "-"}${fmt(mv.monto)}
                      </td>

                      <td style={styles.td}>
                        {mv.cuenta_origen || "—"}
                      </td>

                      <td style={styles.td}>
                        {mv.cuenta_destino || "—"}
                      </td>

                      <td style={styles.td}>
                        {mv.descripcion ||
                          mv.concepto ||
                          mv.sucursal ||
                          "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarConfirmacion && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              Confirmar operación
            </h2>

            <p style={styles.modalText}>
              ¿Deseas realizar{" "}
              {tipoOperacion === "deposito"
                ? "el depósito"
                : "el retiro"}{" "}
              de{" "}
              <strong style={{ color: "#c084fc" }}>
                ${fmt(monto)}
              </strong>
              ?
            </p>

            <div style={styles.modalButtons}>
              <button
                style={styles.cancelButton}
                onClick={() =>
                  setMostrarConfirmacion(false)
                }
              >
                Cancelar
              </button>

              <button
                style={{
                  ...styles.confirmButton,
                  opacity: loading ? 0.6 : 1,
                }}
                onClick={() => {
                  realizarOperacion(tipoOperacion);
                  setMostrarConfirmacion(false);
                }}
                disabled={loading}
              >
                {loading
                  ? "Procesando..."
                  : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}