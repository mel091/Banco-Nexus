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
