import { useState } from "react";
import styles from "../styles/styles";
import Campo from "./Campo";
import { fmt, getMensajeColor } from "../helpers";

export default function Transferencias({
  usuario,
  setUsuario,
  showToast,
}) {
  const [tab, setTab] = useState("nueva");

  const [cuentasDestino, setCuentasDestino] = useState([]);
  const [nuevaCuenta,    setNuevaCuenta]    = useState("");
  const [nuevoAlias,     setNuevoAlias]     = useState("");
  const [loadingAdd,     setLoadingAdd]     = useState(false);
  const [modalAgregar,   setModalAgregar]   = useState(false);

  const [destino,    setDestino]    = useState("");
  const [montoTx,    setMontoTx]    = useState("");
  const [mensajeTx,  setMensajeTx]  = useState("");
  const [loadingTx,  setLoadingTx]  = useState(false);
  const [modalTx,    setModalTx]    = useState(false);
  const [mensaje,    setMensaje]    = useState({ texto: "", tipo: "" });

  const agregarCuenta = () => {
    if (!/^\d{10}$/.test(nuevaCuenta)) {
      showToast("El número de cuenta debe tener exactamente 10 dígitos", "error");
      return;
    }
    if (!nuevoAlias.trim()) {
      showToast("Ingresa un alias", "error");
      return;
    }

    setCuentasDestino([
      ...cuentasDestino,
      { numero_cuenta: nuevaCuenta, alias: nuevoAlias },
    ]);
    showToast("Cuenta agregada exitosamente");
    setNuevaCuenta("");
    setNuevoAlias("");
    setModalAgregar(false);
  };

  const realizarTransferencia = () => {
    if (!destino) {
      showToast("Selecciona una cuenta destino", "error"); return;
    }
    if (!montoTx || Number(montoTx) <= 0) {
      showToast("Monto inválido", "error"); return;
    }
    if (Number(montoTx) > Number(usuario?.saldo || 0)) {
      showToast("Saldo insuficiente", "error"); return;
    }

    setLoadingTx(true);
    setTimeout(() => {
      setUsuario({
        ...usuario,
        saldo: Number(usuario.saldo) - Number(montoTx),
      });
      setMensaje({
        texto: "Transferencia realizada exitosamente",
        tipo:  "success",
      });
      showToast("Transferencia realizada exitosamente");
      setDestino(""); setMontoTx(""); setMensajeTx(""); setModalTx(false);
      setLoadingTx(false);
    }, 700);
  };

  const cuentaSeleccionada = cuentasDestino.find(
    (c) => c.numero_cuenta === destino
  );

  return (
    <>
      <div style={styles.seccionHeader}>
        <h1 style={styles.seccionTitulo}>Transferencias</h1>
        <p style={styles.seccionSub}>Envía dinero de forma segura</p>
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
      <p style={styles.balanceLabel}>
        Saldo disponible
      </p>

      <h1 style={styles.balance}>
        ${fmt(usuario?.saldo ?? 0)}
      </h1>
    </div>
  </div>
</div>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tabBtn, ...(tab === "nueva" ? styles.tabBtnActive : {}) }}
          onClick={() => setTab("nueva")}
        >
          ⇄ Nueva transferencia
        </button>
        <button
          style={{ ...styles.tabBtn, ...(tab === "cuentas" ? styles.tabBtnActive : {}) }}
          onClick={() => setTab("cuentas")}
        >
          ◉ Cuentas guardadas
        </button>
      </div>

      {tab === "nueva" && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Nueva transferencia</h2>
          <div style={styles.operationBox}>

            {cuentasDestino.length > 0 && (
              <>
                <label style={styles.label}>Cuentas guardadas:</label>
                <div style={styles.cuentasGrid}>
                  {cuentasDestino.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.cuentaCard,
                        ...(destino === c.numero_cuenta ? styles.cuentaCardActive : {}),
                      }}
                      onClick={() => setDestino(c.numero_cuenta)}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>👤</div>
                      <div style={{ fontWeight: "bold", color: "#fff", fontSize: 13 }}>
                        {c.alias}
                      </div>
                      <div style={{ color: "#555", fontSize: 11 }}>
                        {c.numero_cuenta}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Campo label="Cuenta destino (10 dígitos)">
              <input
                type="text"
                style={styles.input}
                placeholder="1800000000"
                value={destino}
                onChange={(e) =>
                  setDestino(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
              {cuentaSeleccionada && (
                <p style={{ color: "#c084fc", fontSize: 12, marginTop: 4 }}>
                  → {cuentaSeleccionada.alias}
                </p>
              )}
            </Campo>

            <Campo label="Monto (MXN)">
              <input
                type="number"
                style={styles.input}
                placeholder="0.00"
                value={montoTx}
                onChange={(e) => setMontoTx(e.target.value)}
              />
            </Campo>

            <Campo label="Mensaje (opcional)">
              <input
                type="text"
                style={styles.input}
                placeholder="Renta, deuda, regalo…"
                value={mensajeTx}
                onChange={(e) => setMensajeTx(e.target.value)}
              />
            </Campo>

            <button style={styles.btnPrimario} onClick={() => setModalTx(true)}>
              Transferir
            </button>

            {mensaje.texto && (
              <p style={styles.status}>
                <span style={{ color: getMensajeColor(mensaje.tipo) }}>
                  ● {mensaje.texto}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "cuentas" && (
        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2 style={styles.cardTitle}>Cuentas destino guardadas</h2>
            <button style={styles.btnSecundario} onClick={() => setModalAgregar(true)}>
              + Agregar cuenta
            </button>
          </div>

          {cuentasDestino.length === 0 ? (
            <p style={styles.sinDatos}>No tienes cuentas registradas aún</p>
          ) : (
            <div style={styles.cuentasGrid}>
              {cuentasDestino.map((c, i) => (
                <div key={i} style={styles.cuentaCardGrande}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
                  <div style={{ fontWeight: "bold", color: "#fff", fontSize: 16, marginBottom: 4 }}>
                    {c.alias}
                  </div>
                  <div style={{ color: "#c084fc", fontSize: 13, fontFamily: "monospace", letterSpacing: 2 }}>
                    {c.numero_cuenta}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {modalAgregar && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Agregar cuenta destino</h2>
            <Campo label="Número de cuenta (10 dígitos)">
              <input
                type="text"
                style={styles.input}
                placeholder="1800000000"
                value={nuevaCuenta}
                onChange={(e) =>
                  setNuevaCuenta(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
            </Campo>
            <Campo label="Alias">
              <input
                type="text"
                style={styles.input}
                placeholder="Mamá, Amigo, Renta…"
                value={nuevoAlias}
                onChange={(e) => setNuevoAlias(e.target.value)}
              />
            </Campo>
            <div style={styles.modalButtons}>
              <button style={styles.cancelButton} onClick={() => setModalAgregar(false)}>
                Cancelar
              </button>
              <button
                style={{ ...styles.confirmButton, opacity: loadingAdd ? 0.6 : 1 }}
                onClick={agregarCuenta}
                disabled={loadingAdd}
              >
                {loadingAdd ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalTx && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Confirmar transferencia</h2>
            <p style={styles.modalText}>
              Enviar <strong style={{ color: "#c084fc" }}>${fmt(montoTx)}</strong>{" "}
              a la cuenta <strong style={{ color: "#c084fc" }}>{destino}</strong>
              {cuentaSeleccionada && <> ({cuentaSeleccionada.alias})</>}
              {mensajeTx && (
                <>
                  <br />
                  <span style={{ color: "#555" }}>"{mensajeTx}"</span>
                </>
              )}
            </p>
            <div style={styles.modalButtons}>
              <button style={styles.cancelButton} onClick={() => setModalTx(false)}>
                Cancelar
              </button>
              <button
                style={{ ...styles.confirmButton, opacity: loadingTx ? 0.6 : 1 }}
                onClick={realizarTransferencia}
                disabled={loadingTx}
              >
                {loadingTx ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}