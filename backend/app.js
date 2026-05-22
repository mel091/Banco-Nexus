import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import connectDB from "./config/database.js";

dotenv.config();

const isRetryableMongoError = (error) => {
  const errorLabels = error?.errorLabels || [];

  return (
    error?.name === "MongoNetworkError" ||
    error?.name === "MongoNetworkTimeoutError" ||
    error?.name === "MongoServerSelectionError" ||
    error?.name === "MongoWriteConcernError" ||
    errorLabels.includes("RetryableWriteError") ||
    errorLabels.includes("TransientTransactionError")
  );
};

const getMongoErrorStatus = (error) => {
  if (error?.statusCode) {
    return error.statusCode;
  }

  return isRetryableMongoError(error) ? 503 : 500;
};

const getUpdatedDocument = (result) => {
  return result?.value ?? result;
};

const runWithRetry = async (operation, retries = 1) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryableMongoError(error) || attempt === retries) {
        throw error;
      }
    }
  }

  throw lastError;
};

const handleMongoError = (error, res) => {
  const statusCode = getMongoErrorStatus(error);
  const message =
    statusCode === 503
      ? "Servicio temporalmente no disponible"
      : error.message;

  res.status(statusCode).json({
    message,
  });
};

const startServer = async () => {
  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());

  const db = mongoose.connection.db;

  // CONSULTAR CUENTA
  app.get("/api/cuenta/:cuenta", async (req, res) => {
    try {
      const { cuenta } = req.params;

      const cuentaEncontrada = await runWithRetry(
        () =>
          db.collection("cuentas").findOne({
            numero_cuenta: cuenta,
          }),
        1
      );

      if (!cuentaEncontrada) {
        return res.status(404).json({
          message: "Cuenta no encontrada",
        });
      }

      const cliente = await runWithRetry(
        () =>
          db.collection("clientes").findOne({
            cliente_id: cuentaEncontrada.cliente_id,
          }),
        1
      );

      const transacciones = await runWithRetry(
        () =>
          db
            .collection("transacciones")
            .find({
              $or: [
                {
                  cuenta_origen: cuenta,
                },
                {
                  cuenta_destino: cuenta,
                },
              ],
            })
            .sort({
              fecha_hora: -1,
            })
            .toArray(),
        1
      );

      res.json({
        cliente: cliente.nombre,
        numero_cuenta:
          cuentaEncontrada.numero_cuenta,
        saldo: cuentaEncontrada.saldo,
        tipo: cuentaEncontrada.tipo,
        estado: cuentaEncontrada.estado,
        transacciones,
      });
    } catch (error) {
      handleMongoError(error, res);
    }
  });

  // DEPÓSITO
  app.post("/api/deposito", async (req, res) => {
    try {
      const { cuenta, monto, sucursal } =
        req.body;

      if (!monto || Number(monto) <= 0) {
        return res.status(400).json({
          message: "Monto inválido",
        });
      }

      const session = await mongoose.startSession();
      let saldoActualizado;

      try {
        await session.withTransaction(async () => {
          const resultado = await db
            .collection("cuentas")
            .findOneAndUpdate(
              {
                numero_cuenta: cuenta,
                estado: "activa",
              },
              {
                $inc: {
                  saldo: Number(monto),
                },
              },
              {
                returnDocument: "after",
                session,
              }
            );

          const cuentaActualizada = getUpdatedDocument(
            resultado
          );

          if (!cuentaActualizada) {
            const error = new Error(
              "Cuenta no encontrada"
            );
            error.statusCode = 404;
            throw error;
          }

          saldoActualizado = cuentaActualizada.saldo;

          await db.collection("transacciones").insertOne(
            {
              transaccion_id: new ObjectId(),
              cuenta_origen: "EFECTIVO",
              cuenta_destino: cuenta,
              monto: Number(monto),
              tipo: "Deposito",
              descripcion: "Depósito realizado",
              sucursal:
                sucursal || "Matriz",
              fecha_hora: new Date(),
              estado: "aprobada",
            },
            {
              session,
            }
          );
        });
      } finally {
        await session.endSession();
      }

      res.json({
        message: "Depósito realizado",
        saldo: saldoActualizado,
      });
    } catch (error) {
      handleMongoError(error, res);
    }
  });

  // RETIRO
  app.post("/api/retiro", async (req, res) => {
    try {
      const { cuenta, monto, sucursal } =
        req.body;

      if (!monto || Number(monto) <= 0) {
        return res.status(400).json({
          message: "Monto inválido",
        });
      }

      const session = await mongoose.startSession();
      let saldoActualizado;

      try {
        await session.withTransaction(async () => {
          const resultado = await db
            .collection("cuentas")
            .findOneAndUpdate(
              {
                numero_cuenta: cuenta,
                estado: "activa",
                saldo: {
                  $gte: Number(monto),
                },
              },
              {
                $inc: {
                  saldo: -Number(monto),
                },
              },
              {
                returnDocument: "after",
                session,
              }
            );

          const cuentaActualizada = getUpdatedDocument(
            resultado
          );

          if (!cuentaActualizada) {
            const error = new Error(
              "Fondos insuficientes o cuenta no encontrada"
            );
            error.statusCode = 400;
            throw error;
          }

          saldoActualizado = cuentaActualizada.saldo;

          await db.collection("transacciones").insertOne(
            {
              transaccion_id: new ObjectId(),
              cuenta_origen: cuenta,
              cuenta_destino: "EFECTIVO",
              monto: Number(monto),
              tipo: "Retiro",
              descripcion: "Retiro realizado",
              sucursal:
                sucursal || "Matriz",
              fecha_hora: new Date(),
              estado: "aprobada",
            },
            {
              session,
            }
          );
        });
      } finally {
        await session.endSession();
      }

      res.json({
        message: "Retiro realizado",
        saldo: saldoActualizado,
      });
    } catch (error) {
      handleMongoError(error, res);
    }
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log(
      `✅ Server running on port ${
        process.env.PORT || 3000
      }`
    );
  });
};

startServer();