import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import DestinationAccount from '../models/DestinationAccount.js';
import { logEvent } from '../middleware/auditMiddleware.js';

export const getDashboard = async (req, res) => {
  try {
    const account = await Account.findOne({ cliente_id: req.user.cliente_id });
    
    if (!account) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json({
      saldo_disponible: account.saldo,
      moneda: 'MXN',
      numero_cuenta: account.numero_cuenta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const account = await Account.findOne({ cliente_id: req.user.cliente_id });
    
    if (!account) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    const transactions = await Transaction.find({
      $or: [
        { cuenta_origen: account.numero_cuenta },
        { cuenta_destino: account.numero_cuenta }
      ]
    }).sort({ fecha_hora: -1 });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const addDestinationAccount = async (req, res) => {
  try {
    const { numero_cuenta_destino, alias } = req.body;

    if (!numero_cuenta_destino || numero_cuenta_destino.length < 10) {
      return res.status(400).json({ message: 'Número de cuenta inválido' });
    }

    const destAccount = await Account.findOne({ numero_cuenta: numero_cuenta_destino });
    if (!destAccount) {
      return res.status(404).json({ message: 'La cuenta destino no existe' });
    }

    const myAccount = await Account.findOne({ cliente_id: req.user.cliente_id });
    if (myAccount.numero_cuenta === numero_cuenta_destino) {
        return res.status(400).json({ message: 'No puedes agregar tu propia cuenta como destino' });
    }

    const existingDest = await DestinationAccount.findOne({
      cliente_id: req.user.cliente_id,
      numero_cuenta_destino
    });

    if (existingDest) {
      return res.status(400).json({ message: 'La cuenta ya está registrada' });
    }

    const destination = await DestinationAccount.create({
      cliente_id: req.user.cliente_id,
      numero_cuenta_destino,
      alias
    });

    await logEvent(req.user.cliente_id, 'alta_cuenta_terceros', 'exitoso', { numero_cuenta_destino, alias });

    res.status(201).json(destination);
  } catch (error) {
    console.error(error);
    await logEvent(req.user.cliente_id, 'alta_cuenta_terceros', 'fallido', { error: error.message });
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getDestinationAccounts = async (req, res) => {
    try {
        const destinations = await DestinationAccount.find({ cliente_id: req.user.cliente_id });
        res.json(destinations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
