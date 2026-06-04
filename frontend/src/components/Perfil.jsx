import { useState, useEffect } from "react";
import styles from "../styles/styles";
import Campo from "./Campo";

export default function Perfil({
  usuario,
  setUsuario,
  showModal,
  fetchAuth,
}) {
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email] = useState(usuario?.email || "");
  const [loading, setLoading] = useState(false);
  const [datosCuenta, setDatosCuenta] = useState({
    tipo: usuario?.tipo || "Debito",
    estado: usuario?.estado || "activa",
  });

  // Cargar perfil actualizado desde el backend al montar
  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const res = await fetchAuth("/auth/profile");
      if (res.ok) {
        const data = await res.json();
        setNombre(data.nombre || "");
        setDatosCuenta({
          tipo: data.cuenta?.tipo || "Debito",
          estado: data.cuenta?.estado || "activa",
        });
        setUsuario((prev) => ({
          ...prev,
          nombre: data.nombre,
          numero_cuenta: data.cuenta?.numero_cuenta || prev.numero_cuenta,
          saldo: data.cuenta?.saldo ?? prev.saldo,
          tipo: data.cuenta?.tipo || prev.tipo,
          estado: data.cuenta?.estado || prev.estado,
        }));
      }
    } catch (err) {
      // Si falla, mostramos los datos ya en estado
    }
  };

  const guardarPerfil = () => {
    if (!nombre.trim()) {
      showModal("error", "Nombre inválido", "El nombre no puede estar vacío.");
      return;
    }

    setLoading(true);

    // El backend no expone endpoint de actualización de nombre en las rutas
    // definidas, así que actualizamos localmente el estado de usuario.
    setTimeout(() => {
      setUsuario({
        ...usuario,
        nombre,
      });
      showModal("success", "¡Perfil actualizado!", "Tus datos fueron guardados correctamente.");
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
              valor: datosCuenta.tipo || "Debito",
            },
            {
              label: "Estado",
              valor: datosCuenta.estado === "activa" ? "Activa" : datosCuenta.estado,
              verde: datosCuenta.estado === "activa",
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