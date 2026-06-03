import mongoose from 'mongoose';

const destinationAccountSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  numero_cuenta_destino: {
    type: String,
    required: true
  },
  alias: {
    type: String,
    required: true
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  }
});

const DestinationAccount = mongoose.model('DestinationAccount', destinationAccountSchema, 'cuentas_destino');

export default DestinationAccount;
