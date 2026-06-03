// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Orquestador principal de Banco Nexus
// Maneja: estado global, toast, sidebar, enrutamiento entre vistas
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";

import styles          from "./styles/styles";
import Sidebar         from "./components/Sidebar";
import Login           from "./components/Login";
import Register        from "./components/Register";
import Dashboard       from "./components/Dashboard";
import Transferencias  from "./components/Transferencias";
import Perfil          from "./components/Perfil";

// URL base del backend (se define en .env como VITE_API_URL)
const API = import.meta.env.VITE_API_URL || "/api";

export default function BancoNexus() {
  // ── Estado global ──
  const [vista,   setVista]   = useState("login");
  const [token,   setToken]   = useState(null);
  const [usuario, setUsuario] = useState(null);

  // ── Sidebar ──
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Infraestructura / monitoreo ──
  const [latencia,      setLatencia]      = useState(null);
  const [alertaReplica, setAlertaReplica] = useState("");

  // ── Toast ──
  const [toast, setToast] = useState(null);

  const showToast = (texto, tipo = "success") => {
    setToast({ texto, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Helpers de fetch (para usar cuando haya backend) ──
  const fetchPublico = async (path, body) => {
    const inicio = Date.now();
    const res = await fetch(`${API}${path}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const t = Date.now() - inicio;
    setLatencia(t);
    if (t > 3000) setAlertaReplica("Alta latencia detectada");
    if (res.status === 503) throw new Error("Servicio temporalmente no disponible");
    return res;
  };

  const fetchAuth = async (path, opts = {}) => {
    const inicio = Date.now();
    const res = await fetch(`${API}${path}`, {
      ...opts,
      headers: {
        "Content-Type":  "application/json",
        Authorization:   `Bearer ${token}`,
        ...(opts.headers || {}),
      },
    });
    const t = Date.now() - inicio;
    setLatencia(t);
    if (t > 3000) setAlertaReplica("Alta latencia detectada");
    if (res.status === 503) throw new Error("Servicio temporalmente no disponible");
    return res;
  };

  // ── Logout ──
  const logout = () => {
    setToken(null);
    setUsuario(null);
    setVista("login");
    setLatencia(null);
    setAlertaReplica("");
  };

  const loggedIn = !!token;

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.appRoot}>

      {/* Fondo decorativo */}
      <div style={styles.bgGlow} />

      {/* Toast global */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            borderColor: toast.tipo === "error" ? "#ef4444" : "#a855f7",
          }}
        >
          <span
            style={{
              color:       toast.tipo === "error" ? "#f87171" : "#4ade80",
              marginRight: 8,
            }}
          >
            {toast.tipo === "error" ? "✕" : "✓"}
          </span>
          {toast.texto}
        </div>
      )}

      {/* Alerta réplica / latencia */}
      {alertaReplica && (
        <div style={styles.alertaReplica}>
          ⚠ {alertaReplica}
          <button
            style={styles.alertaClose}
            onClick={() => setAlertaReplica("")}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Layout autenticado ── */}
      {loggedIn ? (
        <div style={styles.layout}>

          <Sidebar
            vista={vista}
            setVista={setVista}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            usuario={usuario}
            onLogout={logout}
          />

          <main style={styles.main}>
            {latencia && (
              <div style={styles.latencia}>⏱ {latencia} ms</div>
            )}

            {vista === "dashboard" && (
              <Dashboard
                usuario={usuario}
                setUsuario={setUsuario}
                showToast={showToast}
                // fetchAuth={fetchAuth}
              />
            )}

            {vista === "transferencias" && (
              <Transferencias
                usuario={usuario}
                setUsuario={setUsuario}
                showToast={showToast}
                // fetchAuth={fetchAuth}
              />
            )}

            {vista === "perfil" && (
              <Perfil
                usuario={usuario}
                setUsuario={setUsuario}
                showToast={showToast}
                // fetchAuth={fetchAuth}
              />
            )}
          </main>
        </div>

      ) : (
        /* ── Vistas públicas ── */
        <div style={styles.publicWrap}>
          <div style={styles.publicLogo}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={{ ...styles.logoText, fontSize: 28 }}>
              Banco <strong>Nexus</strong>
            </span>
          </div>

          {vista === "login" && (
            <Login
              showToast={showToast}
              onLogin={(tk, user) => {
                setToken(tk);
                setUsuario(user);
                setVista("dashboard");
              }}
              onGoRegister={() => setVista("register")}
              // fetchPublico={fetchPublico}
            />
          )}

          {vista === "register" && (
            <Register
              showToast={showToast}
              onGoLogin={() => setVista("login")}
              // fetchPublico={fetchPublico}
            />
          )}
        </div>
      )}
    </div>
  );
}
