import { useState } from "react";
import styles from "../styles/styles";
import Campo from "./Campo";

// ── Regex de validación ──
const RE_CURP =
  /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;

const RE_EMAIL =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
const RE_PASS =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Register({
  onGoLogin,
  showModal,
  fetchPublico,
}) {
  const [nombre,   setNombre]   = useState("");
  const [curp,     setCurp]     = useState("");
  const [telefono, setTelefono] = useState("");
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [cuentaAsignada, setCuentaAsignada] = useState(null);

  // Errores inline por campo
  const [errores, setErrores] = useState({});

  const validar = () => {
    const e = {};

    if (!nombre.trim())
      e.nombre = "El nombre es obligatorio.";

    if (!curp.trim())
      e.curp = "La CURP es obligatoria.";
    else if (!RE_CURP.test(curp))
      e.curp = "CURP inválido. Ejemplo: AAAA000000HXXXXXX0";

    if (!telefono.trim())
      e.telefono = "El teléfono es obligatorio.";
    else if (telefono.length !== 10)
      e.telefono = "El teléfono debe tener exactamente 10 dígitos.";

    if (!email.trim())
      e.email = "El correo es obligatorio.";
    else if (!RE_EMAIL.test(email))
      e.email = "Ingresa un correo válido.";

    if (!pass)
      e.pass = "La contraseña es obligatoria.";
    else if (!RE_PASS.test(pass))
      e.pass =
        "Mínimo 8 caracteres, una mayúscula, una minúscula y un número.";

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validar()) return;

    setLoading(true);
    try {
      const res = await fetchPublico("/auth/register", {
        nombre,
        curp,
        telefono,
        email,
        password: pass,
      });
      const data = await res.json();

      if (!res.ok) {
        showModal(
          "error",
          "Error al crear la cuenta",
          data.message || "No se pudo completar el registro. Intenta de nuevo."
        );
        return;
      }

      setCuentaAsignada(data.numero_cuenta);
    } catch (err) {
      showModal(
        "error",
        "Error de conexión",
        "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Pantalla de éxito post-registro ──
  if (cuentaAsignada) {
    return (
      <div style={{ ...styles.authCard, textAlign: "center" }}>
        <div style={{ fontSize: 60, color: "#a855f7", marginBottom: 16 }}>
          ⬡
        </div>
        <h2 style={styles.authTitle}>¡Registro exitoso!</h2>
        <p style={{ color: "#888", marginBottom: 12 }}>
          Tu número de cuenta único asignado:
        </p>
        <div style={styles.cuentaDisplay}>{cuentaAsignada}</div>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
          Guarda este número. Lo necesitarás para recibir transferencias.
        </p>
        <button style={styles.btnPrimario} onClick={onGoLogin}>
          Ir al inicio de sesión
        </button>
      </div>
    );
  }

  // ── Estilos de error inline ──
  const inputError = { ...styles.input, borderColor: "#ef4444" };
  const msgError   = { color: "#f87171", fontSize: 12, marginTop: 4 };

  return (
    <div style={styles.authCard}>
      <h2 style={styles.authTitle}>Crear cuenta</h2>
      <p style={styles.authSub}>El número de cuenta se asigna automáticamente</p>

      {/* Nombre */}
      <Campo label="Nombre completo *">
        <input
          type="text"
          style={errores.nombre ? inputError : styles.input}
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setErrores((prev) => ({ ...prev, nombre: undefined }));
          }}
        />
        {errores.nombre && <p style={msgError}>{errores.nombre}</p>}
      </Campo>

      {/* CURP */}
      <Campo label="CURP *">
        <input
          type="text"
          style={errores.curp ? inputError : styles.input}
          value={curp}
          maxLength={18}
          onChange={(e) => {
            setCurp(e.target.value.toUpperCase());
            setErrores((prev) => ({ ...prev, curp: undefined }));
          }}
        />
        {errores.curp && <p style={msgError}>{errores.curp}</p>}
      </Campo>

      {/* Teléfono */}
      <Campo label="Teléfono (10 dígitos) *">
        <input
          type="tel"
          style={errores.telefono ? inputError : styles.input}
          value={telefono}
          onChange={(e) => {
            setTelefono(e.target.value.replace(/\D/g, "").slice(0, 10));
            setErrores((prev) => ({ ...prev, telefono: undefined }));
          }}
        />
        {errores.telefono && <p style={msgError}>{errores.telefono}</p>}
      </Campo>

      {/* Correo */}
      <Campo label="Correo electrónico *">
        <input
          type="email"
          style={errores.email ? inputError : styles.input}
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrores((prev) => ({ ...prev, email: undefined }));
          }}
        />
        {errores.email && <p style={msgError}>{errores.email}</p>}
      </Campo>

      {/* Contraseña */}
      <Campo label="Contraseña *">
        <input
          type="password"
          style={errores.pass ? inputError : styles.input}
          placeholder="Mín. 8 car., mayúscula, minúscula y número"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setErrores((prev) => ({ ...prev, pass: undefined }));
          }}
        />
        {errores.pass && <p style={msgError}>{errores.pass}</p>}
      </Campo>

      <button
        style={{ ...styles.btnPrimario, opacity: loading ? 0.6 : 1 }}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p style={styles.authLink}>
        ¿Ya tienes cuenta?{" "}
        <span style={styles.link} onClick={onGoLogin}>
          Inicia sesión
        </span>
      </p>
    </div>
  );
}