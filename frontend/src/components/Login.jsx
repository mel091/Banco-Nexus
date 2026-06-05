import { useState } from "react";
import styles from "../styles/styles";
import Campo from "./Campo";

export default function Login({
  onLogin,
  onGoRegister,
  showModal,
  fetchPublico,
}) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) {
      showModal("error", "Campos incompletos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchPublico("/auth/login", { email, password: pass });
      const data = await res.json();

      if (!res.ok) {
        showModal("error", "Error al iniciar sesión", data.message || "Correo o contraseña incorrectos.");
        return;
      }

      // data: { cliente_id, nombre, email, token }
      // Cargamos también la cuenta para tener saldo y numero_cuenta
      const resProfile = await fetch(
        `${import.meta.env.VITE_API_URL || "/api"}/auth/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      const profile = await resProfile.json();

      const usuario = {
        nombre:        profile.nombre,
        email:         profile.email,
        numero_cuenta: profile.cuenta?.numero_cuenta || "",
        saldo:         profile.cuenta?.saldo ?? 0,
        tipo:          profile.cuenta?.tipo || "Debito",
        estado:        profile.cuenta?.estado || "activa",
      };

      onLogin(data.token, usuario);
    } catch (err) {
      showModal("error", "Error de conexión", "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authCard}>
      <h2 style={styles.authTitle}>
        Iniciar sesión
      </h2>

      <p style={styles.authSub}>
        Bienvenido de vuelta a Banco Nexus
      </p>

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
          placeholder="••••••••"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleLogin()
          }
        />
      </Campo>

      <button
        style={{ ...styles.btnPrimario, opacity: loading ? 0.6 : 1 }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Entrar"}
      </button>

      <p style={styles.authLink}>
        ¿No tienes cuenta?{" "}
        <span
          style={styles.link}
          onClick={onGoRegister}
        >
          Regístrate aquí
        </span>
      </p>
    </div>
  );
}