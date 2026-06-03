import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  cuenta_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId()
  },
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  numero_cuenta: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 16
  },
  tipo: {
    type: String,
    enum: ['Debito', 'Ahorro'],
    default: 'Debito'
  },
  saldo: {
    type: Number,
    default: 0
  },
  estado: {
    type: String,
    enum: ['activa', 'inactiva', 'bloqueada'],
    default: 'activa'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

const Account = mongoose.model('Account', accountSchema, 'cuentas');

export default Account;
