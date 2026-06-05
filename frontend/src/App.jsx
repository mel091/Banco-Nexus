import { useState, useEffect } from "react";

import styles          from "./styles/styles";
import Sidebar         from "./components/Sidebar";
import Login           from "./components/Login";
import Register        from "./components/Register";
import Dashboard       from "./components/Dashboard";
import Transferencias  from "./components/Transferencias";
import Perfil          from "./components/Perfil";
import Modal           from "./components/Modal";

const API = import.meta.env.VITE_API_URL || "/api";
const MOBILE_BP = 768;

export default function BancoNexus() {
  // ── Estado global ──
  const [vista,   setVista]   = useState("login");
  const [token,   setToken]   = useState(null);
  const [usuario, setUsuario] = useState(null);

  // ── Sidebar ──
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Detección mobile ──
  const [mobile, setMobile] = useState(window.innerWidth < MOBILE_BP);
  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < MOBILE_BP;
      setMobile(isMobile);
      // En desktop siempre empieza abierto; en mobile siempre cerrado
      if (!isMobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    // Inicializar estado correcto
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Infraestructura / monitoreo ──
  const [latencia,      setLatencia]      = useState(null);
  const [alertaReplica, setAlertaReplica] = useState("");

  // ── Toast (solo para info no crítica) ──
  const [toast, setToast] = useState(null);
  const showToast = (texto, tipo = "success") => {
    setToast({ texto, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Modal de feedback (error / éxito) ──
  const [feedbackModal, setFeedbackModal] = useState(null);
  const showModal = (tipo, titulo, texto) => setFeedbackModal({ tipo, titulo, texto });
  const closeModal = () => setFeedbackModal(null);

  // ── Helpers de fetch ──
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

  return (
    <div style={styles.appRoot}>
      <div style={styles.bgGlow} />

      {/* Toast global */}
      {toast && (
        <div style={{ ...styles.toast, borderColor: toast.tipo === "error" ? "#ef4444" : "#a855f7" }}>
          <span style={{ color: toast.tipo === "error" ? "#f87171" : "#4ade80", marginRight: 8 }}>
            {toast.tipo === "error" ? "✕" : "✓"}
          </span>
          {toast.texto}
        </div>
      )}

      {/* Modal de feedback */}
      {feedbackModal && (
        <Modal
          tipo={feedbackModal.tipo}
          titulo={feedbackModal.titulo}
          texto={feedbackModal.texto}
          onClose={closeModal}
        />
      )}

      {/* Alerta réplica / latencia */}
      {alertaReplica && (
        <div style={styles.alertaReplica}>
          ⚠ {alertaReplica}
          <button style={styles.alertaClose} onClick={() => setAlertaReplica("")}>×</button>
        </div>
      )}

      {loggedIn ? (
        <div style={styles.layout}>

          <Sidebar
            vista={vista}
            setVista={setVista}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            mobile={mobile}
            usuario={usuario}
            onLogout={logout}
          />

          <div style={styles.mainWrapper}>
            {/* Topbar mobile con botón hamburguesa */}
            {mobile && (
              <div style={styles.mobileTopbar}>
                <button
                  style={styles.hamburgerBtn}
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Abrir menú"
                >
                  <span style={styles.hamburgerLine} />
                  <span style={styles.hamburgerLine} />
                  <span style={styles.hamburgerLine} />
                </button>
                <span style={styles.mobileTopbarLogo}>
                  <span style={{ color: "#a855f7" }}>⬡</span> Banco <strong>Nexus</strong>
                </span>
              </div>
            )}

            <main style={styles.main}>
              {latencia && (
                <div style={styles.latencia}>⏱ {latencia} ms</div>
              )}

              {vista === "dashboard" && (
                <Dashboard
                  usuario={usuario}
                  setUsuario={setUsuario}
                  showToast={showToast}
                  showModal={showModal}
                  fetchAuth={fetchAuth}
                />
              )}

              {vista === "transferencias" && (
                <Transferencias
                  usuario={usuario}
                  setUsuario={setUsuario}
                  showModal={showModal}
                  fetchAuth={fetchAuth}
                />
              )}

              {vista === "perfil" && (
                <Perfil
                  usuario={usuario}
                  setUsuario={setUsuario}
                  showModal={showModal}
                  fetchAuth={fetchAuth}
                />
              )}
            </main>
          </div>
        </div>

      ) : (
        <div style={styles.publicWrap}>
          <div style={styles.publicLogo}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={{ ...styles.logoText, fontSize: 28 }}>
              Banco <strong>Nexus</strong>
            </span>
          </div>

          {vista === "login" && (
            <Login
              showModal={showModal}
              onLogin={(tk, user) => {
                setToken(tk);
                setUsuario(user);
                setVista("dashboard");
              }}
              onGoRegister={() => setVista("register")}
              fetchPublico={fetchPublico}
            />
          )}

          {vista === "register" && (
            <Register
              showModal={showModal}
              onGoLogin={() => setVista("login")}
              fetchPublico={fetchPublico}
            />
          )}
        </div>
      )}
    </div>
  );
}