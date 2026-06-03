import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  fecha_hora: {
    type: Date,
    default: Date.now
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false
  },
  accion: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['exitoso', 'fallido', 'pendiente'],
    required: true
  },
  detalle: {
    type: mongoose.Schema.Types.Mixed
  }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema, 'bitacora_eventos');

export default AuditLog;
