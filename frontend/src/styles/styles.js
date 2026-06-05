const styles = {
  appRoot: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#050505",
    color: "white",
    fontFamily: "Arial",
    position: "relative",
    overflow: "hidden",
  },

  bgGlow: {
    position: "fixed",
    top: "-300px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "900px",
    height: "700px",
    borderRadius: "50%",
    background:
      "radial-gradient(ellipse, rgba(126,34,206,0.10) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },

  // ── LAYOUT ──
  layout: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
  },

  mainWrapper: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  // ── TOPBAR MOBILE ──
  mobileTopbar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    backgroundColor: "#080808",
    borderBottom: "1px solid #111",
    flexShrink: 0,
    zIndex: 10,
  },

  mobileTopbarLogo: {
    color: "#e0e0e0",
    fontSize: 16,
  },

  hamburgerBtn: {
    background: "none",
    border: "1px solid #1a1a1a",
    borderRadius: 8,
    padding: "6px 8px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flexShrink: 0,
  },

  hamburgerLine: {
    display: "block",
    width: 18,
    height: 2,
    backgroundColor: "#a855f7",
    borderRadius: 2,
  },

  // ── SIDEBAR DESKTOP ──
  sidebar: {
    backgroundColor: "#080808",
    borderRight: "1px solid #111",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    boxSizing: "border-box",
    transition: "width 0.2s ease",
    overflow: "hidden",
    flexShrink: 0,
    height: "100vh",
  },

  // ── SIDEBAR MOBILE (drawer flotante) ──
  sidebarOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 100,
  },

  sidebarMobile: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 240,
    height: "100vh",
    backgroundColor: "#080808",
    borderRight: "1px solid #1a1a1a",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    boxSizing: "border-box",
    zIndex: 101,
    transition: "transform 0.25s ease",
    overflowY: "auto",
  },

  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 20px 28px",
    borderBottom: "1px solid #111",
    marginBottom: 12,
    whiteSpace: "nowrap",
  },

  logoIcon: {
    fontSize: 24,
    color: "#a855f7",
    flexShrink: 0,
  },

  logoText: {
    fontSize: 18,
    color: "#e0e0e0",
  },

  sidebarToggle: {
    alignSelf: "flex-end",
    marginRight: 14,
    marginBottom: 8,
    background: "none",
    border: "1px solid #1a1a1a",
    borderRadius: 6,
    color: "#444",
    cursor: "pointer",
    padding: "4px 8px",
    fontSize: 13,
  },

  sidebarNav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "0 10px",
    flex: 1,
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "11px 12px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "transparent",
    color: "#555",
    cursor: "pointer",
    fontSize: 14,
    textAlign: "left",
    whiteSpace: "nowrap",
    width: "100%",
  },

  navItemActive: {
    backgroundColor: "rgba(103, 75, 206, 0.15)",
    color: "#c084fc",
  },

  navIcon: {
    fontSize: 16,
    flexShrink: 0,
    width: 20,
    textAlign: "center",
  },

  navLabel: {
    fontSize: 14,
  },

  sidebarUser: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "16px 20px",
    borderTop: "1px solid #111",
    marginTop: 8,
  },

  sidebarAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    backgroundColor: "#1a0530",
    border: "1px solid #7e22ce",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  },

  sidebarNombre: {
    color: "#ccc",
    fontSize: 13,
    margin: 0,
    fontWeight: "bold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 130,
  },

  sidebarCuenta: {
    color: "#555",
    fontSize: 11,
    margin: 0,
    fontFamily: "monospace",
    whiteSpace: "nowrap",
  },

  // ── MAIN ──
  main: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    padding: "24px clamp(14px, 4vw, 36px)",
    overflowY: "auto",
    overflowX: "hidden",
    boxSizing: "border-box",
  },

  latencia: {
    color: "#333",
    fontSize: 12,
    textAlign: "right",
    marginBottom: 20,
  },

  // ── VISTAS PÚBLICAS ──
  publicWrap: {
    height: "100vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 24px",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
  },

  publicLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  },

  authCard: {
    backgroundColor: "#0e0e0e",
    border: "1px solid #1a1a1a",
    borderRadius: 20,
    padding: 40,
    width: "100%",
    maxWidth: 420,
  },

  authTitle: {
    color: "#c084fc",
    marginBottom: 6,
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 0,
  },

  authSub: {
    color: "#555",
    marginBottom: 28,
    fontSize: 14,
  },

  authLink: {
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },

  link: {
    color: "#a855f7",
    cursor: "pointer",
    textDecoration: "underline",
  },

  cuentaDisplay: {
    fontFamily: "monospace",
    fontSize: 26,
    letterSpacing: 4,
    color: "#c084fc",
    backgroundColor: "#0a0a0a",
    border: "1px solid #7e22ce",
    borderRadius: 12,
    padding: "14px 20px",
    marginBottom: 12,
    display: "inline-block",
  },

  // ── SECCIÓN ──
  seccionHeader: {
    marginBottom: 24,
  },

  seccionTitulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    margin: "0 0 4px",
  },

  seccionSub: {
    color: "#555",
    fontSize: 14,
    margin: 0,
  },

  infoBar: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #111",
    borderRadius: 10,
    padding: "12px 20px",
    marginBottom: 20,
    fontSize: 14,
  },

  // ── TABS ──
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },

  tabBtn: {
    padding: "8px 18px",
    border: "1px solid #1a1a1a",
    borderRadius: 8,
    backgroundColor: "transparent",
    color: "#555",
    cursor: "pointer",
    fontSize: 14,
  },

  tabBtnActive: {
    borderColor: "#7e22ce",
    backgroundColor: "rgba(126,34,206,0.15)",
    color: "#c084fc",
  },

  // ── CARDS ──
  mainCard: {
    backgroundColor: "#0e0e0e",
    border: "1px solid #7e22ce",
    borderRadius: 20,
    padding: "clamp(16px, 3vw, 28px)",
    marginBottom: 24,
  },

  topSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },

  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundColor: "#1a0530",
    border: "2px solid #7e22ce",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
  },

  clientName: {
    margin: 0,
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  accountText: {
    color: "#888",
    margin: "4px 0 0",
    fontSize: 14,
  },

  balanceContainer: {
    textAlign: "right",
  },

  balanceLabel: {
    color: "#555",
    fontSize: 12,
    margin: "0 0 4px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  balance: {
    fontSize: "clamp(28px, 5vw, 48px)",
    margin: 0,
    color: "#c084fc",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#0e0e0e",
    border: "1px solid #111",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },

  cardTitle: {
    color: "#c084fc",
    fontSize: 20,
    fontWeight: "bold",
    margin: "0 0 20px",
  },

  operationBox: {
    display: "flex",
    flexDirection: "column",
  },

  tableContainer: {
    maxHeight: "200px",
    overflowY: "auto",
    overflowX: "auto",
    borderRadius: "10px",
    width: "100%",
  },

  label: {
    color: "#888",
    fontSize: 13,
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #1a1a1a",
    backgroundColor: "#0a0a0a",
    color: "white",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  },

  buttonsRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },

  btnPrimario: {
    padding: "13px 20px",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(90deg,#7e22ce,#a855f7)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 15,
    width: "100%",
  },

  btnSecundario: {
    padding: "9px 16px",
    border: "1px solid #7e22ce",
    borderRadius: 8,
    background: "none",
    color: "#c084fc",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: "bold",
  },

  depositButton: {
    flex: 1,
    minWidth: 200,
    padding: "13px 20px",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(90deg,#7e22ce,#a855f7)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 15,
  },

  withdrawButton: {
    flex: 1,
    minWidth: 200,
    padding: "13px 20px",
    border: "1px solid #7e22ce",
    borderRadius: 10,
    background: "none",
    color: "#c084fc",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 15,
  },

  status: {
    textAlign: "center",
    color: "#ccc",
    marginTop: 12,
  },

  // ── CUENTAS GRID ──
  cuentasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 10,
    marginBottom: 20,
  },

  cuentaCard: {
    border: "1px solid #1a1a1a",
    borderRadius: 12,
    padding: "14px 10px",
    cursor: "pointer",
    textAlign: "center",
  },

  cuentaCardActive: {
    border: "1px solid #7e22ce",
    backgroundColor: "rgba(126,34,206,0.12)",
  },

  cuentaCardGrande: {
    border: "1px solid #1a1a1a",
    borderRadius: 14,
    padding: "20px 16px",
    textAlign: "center",
  },

  // ── TABLA ──
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  th: {
    padding: "10px 12px",
    borderBottom: "1px solid #111",
    textAlign: "left",
    color: "#444",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: "bold",
    position: "sticky",
    top: 0,
    backgroundColor: "#0e0e0e",
    zIndex: 2,
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #0a0a0a",
    color: "#ccc",
    fontSize: 14,
    whiteSpace: "nowrap",
  },

  badge: {
    backgroundColor: "#111",
    color: "#a855f7",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    display: "inline-block",
    border: "1px solid #1a1a1a",
  },

  sinDatos: {
    color: "#333",
    textAlign: "center",
    padding: "30px 0",
    fontSize: 14,
  },

  // ── MODAL ──
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    backgroundColor: "#0e0e0e",
    border: "1px solid #7e22ce",
    borderRadius: 20,
    padding: 32,
    width: "90%",
    maxWidth: 420,
  },

  modalError: {
    backgroundColor: "#0e0e0e",
    border: "1px solid #ef4444",
    borderRadius: 20,
    padding: 32,
    width: "90%",
    maxWidth: 420,
  },

  modalSuccess: {
    backgroundColor: "#0e0e0e",
    border: "1px solid #22c55e",
    borderRadius: 20,
    padding: 32,
    width: "90%",
    maxWidth: 420,
    textAlign: "center",
  },

  modalTitle: {
    color: "#c084fc",
    marginTop: 0,
    marginBottom: 16,
    fontSize: 20,
  },

  modalTitleError: {
    color: "#f87171",
    marginTop: 0,
    marginBottom: 16,
    fontSize: 20,
    textAlign: "center",
  },

  modalTitleSuccess: {
    color: "#4ade80",
    marginTop: 0,
    marginBottom: 16,
    fontSize: 20,
    textAlign: "center",
  },

  modalIcon: {
    fontSize: 52,
    marginBottom: 16,
    display: "block",
  },

  modalText: {
    color: "#ddd",
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 1.6,
  },

  modalButtons: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
  },

  modalButtonsCenter: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginTop: 8,
  },

  cancelButton: {
    padding: "11px 20px",
    border: "1px solid #1a1a1a",
    borderRadius: 10,
    backgroundColor: "transparent",
    color: "#555",
    cursor: "pointer",
    fontSize: 14,
  },

  confirmButton: {
    padding: "11px 24px",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(90deg,#7e22ce,#a855f7)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 14,
  },

  errorButton: {
    padding: "11px 24px",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(90deg,#991b1b,#ef4444)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 14,
  },

  successButton: {
    padding: "11px 32px",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(90deg,#15803d,#22c55e)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 14,
  },

  // ── TOAST / ALERTAS ──
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    backgroundColor: "#0e0e0e",
    border: "1px solid",
    borderRadius: 12,
    padding: "14px 20px",
    color: "#fff",
    zIndex: 9999,
    fontSize: 14,
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    maxWidth: 340,
  },

  alertaReplica: {
    position: "fixed",
    top: 72,
    right: 20,
    backgroundColor: "#7f1d1d",
    border: "1px solid #ef4444",
    padding: "12px 40px 12px 16px",
    borderRadius: 10,
    color: "#fecaca",
    fontSize: 13,
    zIndex: 9998,
    maxWidth: 340,
  },

  alertaClose: {
    position: "absolute",
    top: 8,
    right: 10,
    background: "none",
    border: "none",
    color: "#fca5a5",
    cursor: "pointer",
    fontSize: 18,
  },

  // ── PERFIL INFO ──
  infoItem: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #111",
    borderRadius: 12,
    padding: 16,
  },

  infoLabel: {
    color: "#444",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 6px",
  },

  infoValor: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    margin: 0,
  },
};

export default styles;