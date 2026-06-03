import { useState } from "react";
import styles from "../styles/styles";
import Campo from "./Campo";
import { USUARIO_MOCK, CREDENCIALES_MOCK } from "../helpers";

export default function Login({
  onLogin,
  onGoRegister,
  showToast,
}) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (!email || !pass) {
      showToast("Completa todos los campos", "error");
      return;
    }

    if (
      email === CREDENCIALES_MOCK.email &&
      pass === CREDENCIALES_MOCK.password
    ) {
      onLogin("token-prueba", USUARIO_MOCK);
    } else {
      showToast("Correo o contraseña incorrectos", "error");
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

      <p
        style={{
          color: "#3b3b3b",
          fontSize: 12,
          marginBottom: 16,
          fontFamily: "monospace",
        }}
      >
      </p>

      <button
        style={styles.btnPrimario}
        onClick={handleLogin}
      >
        Entrar
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