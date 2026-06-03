import AuditLog from '../models/AuditLog.js';

export const logEvent = async (usuario_id, accion, estado, detalle) => {
  try {
    const log = new AuditLog({
      usuario_id,
      accion,
      estado,
      detalle
    });
    await log.save();
  } catch (error) {
    console.error('Error al guardar log de auditoría:', error);
  }
};
