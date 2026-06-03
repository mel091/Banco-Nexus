// ─────────────────────────────────────────────────────────────────────────────
// helpers.js — Utilidades compartidas de Banco Nexus
// ─────────────────────────────────────────────────────────────────────────────

// Formatea número como moneda MXN: 5000 → "5,000.00"
export const fmt = (n) =>
  Number(n).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
  });

// Formatea fecha ISO a fecha/hora corta en español
export const fmtFecha = (d) =>
  new Date(d).toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });

// Retorna el color hex según tipo de mensaje
export const getMensajeColor = (tipo) => {
  if (tipo === "error")   return "#f87171";
  if (tipo === "success") return "#4ade80";
  return "#ccc";
};

// ─── DATOS MOCK ───────────────────────────────────────────────────────────────
// Usuario de prueba — se reemplazará por respuesta real del backend

export const USUARIO_MOCK = {
  nombre:        "Administrador",
  email:         "admin@nexus.com",
  numero_cuenta: "1234567890",
  saldo:         5000,
};

// Credenciales de prueba para el login mock
export const CREDENCIALES_MOCK = {
  email:    "admin@nexus.com",
  password: "123456",
};

// Movimientos de prueba para el dashboard
export const MOVIMIENTOS_MOCK = [
  {
    fecha_hora:     "2025-05-01T10:00:00Z",
    tipo:           "Depósito",
    monto:          2000,
    cuenta_origen:  "—",
    cuenta_destino: "1234567890",
    descripcion:    "Nómina mayo",
  },
  {
    fecha_hora:     "2025-05-05T14:30:00Z",
    tipo:           "Transferencia",
    monto:          500,
    cuenta_origen:  "1234567890",
    cuenta_destino: "1800000011",
    descripcion:    "Renta",
  },
  {
    fecha_hora:     "2025-05-10T09:15:00Z",
    tipo:           "Retiro",
    monto:          300,
    cuenta_origen:  "1234567890",
    cuenta_destino: "—",
    descripcion:    "Cajero ATM",
  },
  {
    fecha_hora:     "2025-05-18T16:45:00Z",
    tipo:           "Depósito",
    monto:          1500,
    cuenta_origen:  "—",
    cuenta_destino: "1234567890",
    descripcion:    "Transferencia recibida",
  },
  {
    fecha_hora:     "2025-05-25T11:00:00Z",
    tipo:           "Transferencia",
    monto:          200,
    cuenta_origen:  "1234567890",
    cuenta_destino: "1800000025",
    descripcion:    "Pago de servicios",
  },
];
