import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { logEvent } from '../middleware/auditMiddleware.js';

const handleMongoError = (error, res) => {
  console.error(error);
  res.status(500).json({ message: 'Error procesando la transacción' });
};

export const executeTransfer = async (req, res) => {
  try {
    const { cuenta_destino, monto, mensaje } = req.body;

    if (!monto || Number(monto) <= 0) {
      return res.status(400).json({ message: 'Monto inválido' });
    }

    const myAccount = await Account.findOne({ cliente_id: req.user.cliente_id });

    if (!myAccount) {
        return res.status(404).json({ message: 'Cuenta origen no encontrada' });
    }

    if (myAccount.numero_cuenta === cuenta_destino) {
      return res.status(400).json({ message: 'No puedes transferir a tu propia cuenta' });
    }

    if (myAccount.saldo < Number(monto)) {
      await logEvent(req.user.cliente_id, 'transferencia_fallida', 'fallido', { error: 'Fondos insuficientes', monto, cuenta_destino });
      return res.status(400).json({ message: 'Fondos insuficientes' });
    }

    const destAccount = await Account.findOne({ numero_cuenta: cuenta_destino });
    if (!destAccount) {
        await logEvent(req.user.cliente_id, 'transferencia_fallida', 'fallido', { error: 'Cuenta destino no existe', monto, cuenta_destino });
        return res.status(404).json({ message: 'Cuenta destino no encontrada' });
    }

    const session = await mongoose.startSession();
    let transferExito = false;
    let transferTransactionId = new ObjectId();

    try {
      await session.withTransaction(async () => {
        const updatedOrigen = await Account.findOneAndUpdate(
          { numero_cuenta: myAccount.numero_cuenta, estado: 'activa', saldo: { $gte: Number(monto) } },
          { $inc: { saldo: -Number(monto) } },
          { new: true, session }
        );

        if (!updatedOrigen) {
          throw new Error("Fondos insuficientes o cuenta inactiva");
        }

        const updatedDestino = await Account.findOneAndUpdate(
          { numero_cuenta: cuenta_destino, estado: 'activa' },
          { $inc: { saldo: Number(monto) } },
          { new: true, session }
        );

        if (!updatedDestino) {
          throw new Error("Cuenta destino inactiva o no encontrada");
        }

        await Transaction.create([{
          transaccion_id: transferTransactionId,
          cuenta_origen: myAccount.numero_cuenta,
          cuenta_destino: cuenta_destino,
          monto: Number(monto),
          tipo: 'Transferencia',
          descripcion: mensaje || 'Transferencia entre cuentas',
          sucursal: 'Digital',
          estado: 'aprobada'
        }], { session });

        transferExito = true;
      });
    } catch (error) {
       console.error("Transacción abortada:", error);
       transferExito = false;
       await logEvent(req.user.cliente_id, 'transferencia_fallida', 'fallido', { error: error.message, monto, cuenta_destino });
       return res.status(400).json({ message: error.message || 'Error al procesar la transferencia' });
    } finally {
      await session.endSession();
    }

    if (transferExito) {
        await logEvent(req.user.cliente_id, 'transferencia_exitosa', 'exitoso', { monto, cuenta_destino, transaccion_id: transferTransactionId });
        res.json({ message: 'Transferencia realizada con éxito', transaccion_id: transferTransactionId });
    }

  } catch (error) {
    handleMongoError(error, res);
  }
};
