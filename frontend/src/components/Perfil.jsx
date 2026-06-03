import { useState } from "react";
import styles from "../styles/styles";
import Campo from "./Campo";

export default function Perfil({
  usuario,
  setUsuario,
  showToast,
}) {
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email] = useState(usuario?.email || "");
  const [loading, setLoading] = useState(false);

  const guardarPerfil = () => {
    if (!nombre.trim()) {
      showToast("El nombre no puede estar vacío", "error");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setUsuario({
        ...usuario,
        nombre,
      });

      showToast("Perfil actualizado");
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <div style={styles.seccionHeader}>
        <h1 style={styles.seccionTitulo}>Mi perfil</h1>
        <p style={styles.seccionSub}>
          Información y datos de tu cuenta
        </p>
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
          {usuario?.email}
        </p>
      </div>
    </div>

    <div style={styles.balanceContainer}>
      <p style={styles.balanceLabel}>
        Número de cuenta
      </p>

      <div
        style={{
          ...styles.cuentaDisplay,
          marginBottom: 0,
          fontSize: 22,
          letterSpacing: 3,
          padding: "14px 17px",
        }}
      >
        {usuario?.numero_cuenta}
      </div>
    </div>
  </div>
</div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          Editar datos generales
        </h2>

        <div style={styles.operationBox}>
          <Campo label="Nombre completo">
            <input
              type="text"
              style={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Campo>

          <Campo label="Correo electrónico">
            <input
              type="email"
              style={{
                ...styles.input,
                color: "#555",
                cursor: "not-allowed",
              }}
              value={email}
              disabled
            />

            <p
              style={{
                color: "#444",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              El correo no puede modificarse
            </p>
          </Campo>

          <button
            style={{
              ...styles.btnPrimario,
              opacity: loading ? 0.6 : 1,
            }}
            onClick={guardarPerfil}
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          Información de la cuenta
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              label: "Número de cuenta",
              valor: usuario?.numero_cuenta,
              mono: true,
            },
            {
              label: "Tipo de cuenta",
              valor: "Cuenta de cheques",
            },
            {
              label: "Estado",
              valor: "Activa",
              verde: true,
            },
            {
              label: "Banco",
              valor: "Banco Nexus",
            },
          ].map((item, i) => (
            <div key={i} style={styles.infoItem}>
              <p style={styles.infoLabel}>
                {item.label}
              </p>

              <p
                style={{
                  ...styles.infoValor,
                  color: item.verde
                    ? "#4ade80"
                    : item.mono
                    ? "#c084fc"
                    : "#fff",
                  fontFamily: item.mono
                    ? "monospace"
                    : "inherit",
                  letterSpacing: item.mono
                    ? 2
                    : "normal",
                }}
              >
                {item.valor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}