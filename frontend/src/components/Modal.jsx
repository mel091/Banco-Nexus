/**
 * Modal.jsx — Ventanas emergentes para Banco Nexus
 *
 * Tipos:
 *  - "confirm"  → modal de confirmación morado (ya existente)
 *  - "error"    → modal de error rojo
 *  - "success"  → modal de éxito verde
 */
import styles from "../styles/styles";

export default function Modal({
  tipo = "confirm",   // "confirm" | "error" | "success"
  titulo,
  texto,
  onClose,
  onConfirm,          // solo en tipo "confirm"
  loadingConfirm,     // solo en tipo "confirm"
  labelConfirm = "Confirmar",
  labelCancel  = "Cancelar",
  children,           // contenido personalizado en lugar de texto
}) {
  const esConfirm = tipo === "confirm";
  const esError   = tipo === "error";
  const esExito   = tipo === "success";

  const overlayStyle = styles.modalOverlay;

  const boxStyle = esError
    ? styles.modalError
    : esExito
    ? styles.modalSuccess
    : styles.modal;

  const titleStyle = esError
    ? styles.modalTitleError
    : esExito
    ? styles.modalTitleSuccess
    : styles.modalTitle;

  const icon = esError ? "✕" : esExito ? "✓" : null;
  const iconColor = esError ? "#f87171" : "#4ade80";

  return (
    <div style={overlayStyle} onClick={esConfirm ? undefined : onClose}>
      <div
        style={boxStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícono grande para error / éxito */}
        {icon && (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: esError
                ? "rgba(239,68,68,0.12)"
                : "rgba(34,197,94,0.12)",
              border: `2px solid ${iconColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: iconColor,
              margin: "0 auto 20px",
              fontWeight: "bold",
            }}
          >
            {icon}
          </div>
        )}

        <h2 style={titleStyle}>{titulo}</h2>

        {children ? (
          children
        ) : (
          <p style={{ ...styles.modalText, textAlign: esExito || esError ? "center" : "left" }}>
            {texto}
          </p>
        )}

        {/* Botones */}
        {esConfirm && (
          <div style={styles.modalButtons}>
            <button style={styles.cancelButton} onClick={onClose}>
              {labelCancel}
            </button>
            <button
              style={{ ...styles.confirmButton, opacity: loadingConfirm ? 0.6 : 1 }}
              onClick={onConfirm}
              disabled={loadingConfirm}
            >
              {loadingConfirm ? "Procesando..." : labelConfirm}
            </button>
          </div>
        )}

        {esError && (
          <div style={styles.modalButtonsCenter}>
            <button style={styles.errorButton} onClick={onClose}>
              Entendido
            </button>
          </div>
        )}

        {esExito && (
          <div style={styles.modalButtonsCenter}>
            <button style={styles.successButton} onClick={onClose}>
              ¡Listo!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}