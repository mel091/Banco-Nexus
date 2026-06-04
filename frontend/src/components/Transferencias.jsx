import { useState, useEffect } from "react";
import styles from "../styles/styles";
import Campo from "./Campo";
import { fmt, getMensajeColor } from "../helpers";

export default function Transferencias({
  usuario,
  setUsuario,
  showModal,
  fetchAuth,
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

  // Cargar cuentas destino guardadas al montar
  useEffect(() => {
    cargarCuentasDestino();
  }, []);

  const cargarCuentasDestino = async () => {
    try {
      const res = await fetchAuth("/accounts/destinations");
      if (res.ok) {
        const data = await res.json();
        setCuentasDestino(data);
      }
    } catch (err) {
      // Si falla la carga, seguimos con lista vacía
    }
  };

  const agregarCuenta = async () => {
    if (!/^\d{10}$/.test(nuevaCuenta)) {
      showModal("error", "Número inválido", "El número de cuenta debe tener exactamente 10 dígitos.");
      return;
    }
    if (!nuevoAlias.trim()) {
      showModal("error", "Alias requerido", "Ingresa un alias para identificar esta cuenta.");
      return;
    }

    setLoadingAdd(true);
    try {
      const res = await fetchAuth("/accounts/destinations", {
        method: "POST",
        body: JSON.stringify({
          numero_cuenta_destino: nuevaCuenta,
          alias: nuevoAlias,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        showModal("error", "Error al agregar cuenta", data.message || "No se pudo agregar la cuenta destino.");
        return;
      }

      setCuentasDestino((prev) => [...prev, data]);
      showModal("success", "¡Cuenta agregada!", "La cuenta destino fue guardada exitosamente.");
      setNuevaCuenta("");
      setNuevoAlias("");
      setModalAgregar(false);
    } catch (err) {
      showModal("error", "Error de conexión", "No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoadingAdd(false);
    }
  };

  const realizarTransferencia = async () => {
    if (!destino) {
      showModal("error", "Cuenta requerida", "Selecciona una cuenta destino."); return;
    }
    if (!montoTx || Number(montoTx) <= 0) {
      showModal("error", "Monto inválido", "Ingresa un monto mayor a cero."); return;
    }
    if (Number(montoTx) > Number(usuario?.saldo || 0)) {
      showModal("error", "Saldo insuficiente", `No tienes saldo suficiente. Tu saldo disponible es $${Number(usuario?.saldo || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN.`); return;
    }

    setLoadingTx(true);
    try {
      const res = await fetchAuth("/transfers", {
        method: "POST",
        body: JSON.stringify({
          cuenta_destino: destino,
          monto: Number(montoTx),
          mensaje: mensajeTx,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        showModal("error", "Error en la transferencia", data.message || "No se pudo completar la transferencia. Intenta de nuevo.");
        setModalTx(false);
        return;
      }

      // Actualizar saldo local
      setUsuario((prev) => ({
        ...prev,
        saldo: Number(prev.saldo) - Number(montoTx),
      }));

      showModal("success", "¡Transferencia exitosa!", `Se enviaron $${Number(montoTx).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN a la cuenta ${destino} correctamente.`);
      setDestino(""); setMontoTx(""); setMensajeTx(""); setModalTx(false);
    } catch (err) {
      showModal("error", "Error de conexión", "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.");
      setModalTx(false);
    } finally {
      setLoadingTx(false);
    }
  };

  const cuentaSeleccionada = cuentasDestino.find(
    (c) => (c.numero_cuenta_destino || c.numero_cuenta) === destino
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
                  {cuentasDestino.map((c, i) => {
                    const numCuenta = c.numero_cuenta_destino || c.numero_cuenta;
                    return (
                      <div
                        key={i}
                        style={{
                          ...styles.cuentaCard,
                          ...(destino === numCuenta ? styles.cuentaCardActive : {}),
                        }}
                        onClick={() => setDestino(numCuenta)}
                      >
                        <div style={{ fontSize: 20, marginBottom: 4 }}>👤</div>
                        <div style={{ fontWeight: "bold", color: "#fff", fontSize: 13 }}>
                          {c.alias}
                        </div>
                        <div style={{ color: "#555", fontSize: 11 }}>
                          {numCuenta}
                        </div>
                      </div>
                    );
                  })}
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
              {cuentasDestino.map((c, i) => {
                const numCuenta = c.numero_cuenta_destino || c.numero_cuenta;
                return (
                  <div key={i} style={styles.cuentaCardGrande}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
                    <div style={{ fontWeight: "bold", color: "#fff", fontSize: 16, marginBottom: 4 }}>
                      {c.alias}
                    </div>
                    <div style={{ color: "#c084fc", fontSize: 13, fontFamily: "monospace", letterSpacing: 2 }}>
                      {numCuenta}
                    </div>
                  </div>
                );
              })}
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