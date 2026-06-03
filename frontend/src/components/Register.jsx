import { useState } from "react";
import styles from "../styles/styles";
import Campo from "./Campo";

export default function Register({
  onGoLogin,
  showToast,
}) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [cuentaAsignada, setCuentaAsignada] = useState(null);

  const handleRegister = async () => {
    if (!nombre || !email || !pass) {
      showToast("Completa todos los campos", "error");
      return;
    }

    const idMock = Math.floor(Math.random() * 999999);
    const base = `180${String(idMock).padStart(6, "0")}`;
    const sumaDigitos = base
      .split("")
      .reduce((a, d) => a + Number(d), 0);

    const digitoVerif = sumaDigitos % 10;
    const numeroCuenta = `${base}${digitoVerif}`;

    setLoading(true);

    setTimeout(() => {
      setCuentaAsignada(numeroCuenta);
      showToast("Cuenta creada exitosamente");
      setLoading(false);
    }, 800);
  };

  if (cuentaAsignada) {
    return (
      <div
        style={{
          ...styles.authCard,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 60,
            color: "#a855f7",
            marginBottom: 16,
          }}
        >
        ⬡
        </div>

        <h2 style={styles.authTitle}>
          ¡Registro exitoso!
        </h2>

        <p
          style={{
            color: "#888",
            marginBottom: 12,
          }}
        >
          Tu número de cuenta único asignado:
        </p>

        <div style={styles.cuentaDisplay}>
          {cuentaAsignada}
        </div>

        <p
          style={{
            color: "#555",
            fontSize: 13,
            marginBottom: 28,
            lineHeight: 1.6,
          }}
        >
          Guarda este número. Lo necesitarás para
          recibir transferencias.
        </p>

        <button
          style={styles.btnPrimario}
          onClick={onGoLogin}
        >
          Ir al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <div style={styles.authCard}>
      <h2 style={styles.authTitle}>
        Crear cuenta
      </h2>

      <p style={styles.authSub}>
        El número de cuenta se asigna automáticamente
      </p>

      <Campo label="Nombre completo">
        <input
          type="text"
          style={styles.input}
          placeholder="Juan Pérez"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </Campo>

      <Campo label="Correo electrónico">
        <input
          type="email"
          style={styles.input}
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Campo>

      <Campo label="Contraseña">
        <input
          type="password"
          style={styles.input}
          placeholder="Mínimo 8 caracteres"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
      </Campo>

      <button
        style={{
          ...styles.btnPrimario,
          opacity: loading ? 0.6 : 1,
        }}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading
          ? "Creando cuenta..."
          : "Crear cuenta →"}
      </button>

      <p style={styles.authLink}>
        ¿Ya tienes cuenta?{" "}
        <span
          style={styles.link}
          onClick={onGoLogin}
        >
          Inicia sesión
        </span>
      </p>
    </div>
  );
}