import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transaccion_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId()
  },
  cuenta_origen: {
    type: String,
    required: true
  },
  cuenta_destino: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true,
    min: 0.01
  },
  tipo: {
    type: String,
    enum: ['Deposito', 'Retiro', 'Transferencia'],
    required: true
  },
  descripcion: {
    type: String
  },
  sucursal: {
    type: String,
    default: 'Digital'
  },
  fecha_hora: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['aprobada', 'rechazada', 'pendiente'],
    default: 'aprobada'
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema, 'transacciones');

export default Transaction;
