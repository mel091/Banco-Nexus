import { useEffect } from "react";
import styles from "../styles/styles";

const NAV_ITEMS = [
  { id: "dashboard",      icon: "◈", label: "Dashboard" },
  { id: "transferencias", icon: "⇄", label: "Transferencias" },
  { id: "perfil",         icon: "◉", label: "Mi perfil" },
];

export default function Sidebar({
  vista,
  setVista,
  open,
  setOpen,
  mobile,       // bool — viene de App, true cuando ancho < 768
  usuario,
  onLogout,
}) {
  // Cerrar con Escape en mobile
  useEffect(() => {
    if (!mobile) return;
    const handler = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobile, setOpen]);

  const navegar = (id) => {
    setVista(id);
    if (mobile) setOpen(false); // cierra el drawer al navegar en mobile
  };

  // ── MOBILE: sidebar como drawer flotante ──
  if (mobile) {
    return (
      <>
        {/* Overlay oscuro */}
        {open && (
          <div
            style={styles.sidebarOverlay}
            onClick={() => setOpen(false)}
          />
        )}

        {/* Drawer */}
        <aside
          style={{
            ...styles.sidebarMobile,
            transform: open ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div style={styles.sidebarLogo}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={styles.logoText}>
              Banco <strong>Nexus</strong>
            </span>
          </div>

          <nav style={styles.sidebarNav}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                title={item.label}
                style={{
                  ...styles.navItem,
                  ...(vista === item.id ? styles.navItemActive : {}),
                }}
                onClick={() => navegar(item.id)}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span style={styles.navLabel}>{item.label}</span>
              </button>
            ))}
          </nav>

          {usuario && (
            <div style={styles.sidebarUser}>
              <div style={styles.sidebarAvatar}>👤</div>
              <div>
                <p style={styles.sidebarNombre}>
                  {usuario.nombre || usuario.cliente}
                </p>
                <p style={styles.sidebarCuenta}>{usuario.numero_cuenta}</p>
              </div>
            </div>
          )}

          <button
            title="Cerrar sesión"
            style={{ ...styles.navItem, color: "#555" }}
            onClick={onLogout}
          >
            <span style={styles.navIcon}>⏻</span>
            <span style={styles.navLabel}>Salir</span>
          </button>
        </aside>
      </>
    );
  }

  // ── DESKTOP: sidebar colapsable ──
  return (
    <aside style={{ ...styles.sidebar, width: open ? 220 : 64 }}>
      <div style={styles.sidebarLogo}>
        <span style={styles.logoIcon}>⬡</span>
        {open && (
          <span style={styles.logoText}>
            Banco <strong>Nexus</strong>
          </span>
        )}
      </div>

      <button style={styles.sidebarToggle} onClick={() => setOpen(!open)}>
        {open ? "←" : "→"}
      </button>

      <nav style={styles.sidebarNav}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            title={item.label}
            style={{
              ...styles.navItem,
              ...(vista === item.id ? styles.navItemActive : {}),
            }}
            onClick={() => navegar(item.id)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {open && <span style={styles.navLabel}>{item.label}</span>}
          </button>
        ))}
      </nav>

      {open && usuario && (
        <div style={styles.sidebarUser}>
          <div style={styles.sidebarAvatar}>👤</div>
          <div>
            <p style={styles.sidebarNombre}>
              {usuario.nombre || usuario.cliente}
            </p>
            <p style={styles.sidebarCuenta}>{usuario.numero_cuenta}</p>
          </div>
        </div>
      )}

      <button
        title="Cerrar sesión"
        style={{ ...styles.navItem, marginTop: "auto", color: "#555" }}
        onClick={onLogout}
      >
        <span style={styles.navIcon}>⏻</span>
        {open && <span style={styles.navLabel}>Salir</span>}
      </button>
    </aside>
  );
}