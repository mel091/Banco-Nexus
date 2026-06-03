import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId()
  },
  nombre: {
    type: String,
    required: true
  },
  curp: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: Boolean,
    default: true
  }
});

const Client = mongoose.model('Client', clientSchema, 'clientes');

export default Client;
