import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import connectDB from "./config/database.js";

dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/cuenta/:cuenta", async (req, res) => {
    try {
      const { cuenta } = req.params;

      const db = mongoose.connection.db;

      const cuentaEncontrada = await db.collection("cuentas").findOne({
        numero_cuenta: cuenta,
      });

      if (!cuentaEncontrada) {
        return res.status(404).json({
          message: "Cuenta no encontrada",
        });
      }

      const cliente = await db.collection("clientes").findOne({
        cliente_id: cuentaEncontrada.cliente_id,
      });

      const transacciones = await db
        .collection("transacciones")
        .find({
          $or: [
            { cuenta_origen: cuenta },
            { cuenta_destino: cuenta },
          ],
        })
        .sort({ fecha_hora: -1 })
        .toArray();

      res.json({
        cliente: cliente.nombre,
        numero_cuenta: cuentaEncontrada.numero_cuenta,
        saldo: cuentaEncontrada.saldo,
        tipo: cuentaEncontrada.tipo,
        transacciones,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  app.post("/api/deposito", async (req, res) => {
    try {
      const { cuenta, monto } = req.body;

      const db = mongoose.connection.db;

      const cuentaEncontrada = await db.collection("cuentas").findOne({
        numero_cuenta: cuenta,
      });

      if (!cuentaEncontrada) {
        return res.status(404).json({
          message: "Cuenta no encontrada",
        });
      }

      const nuevoSaldo =
        cuentaEncontrada.saldo + Number(monto);

      await db.collection("cuentas").updateOne(
        {
          numero_cuenta: cuenta,
        },
        {
          $set: {
            saldo: nuevoSaldo,
          },
        }
      );

      await db.collection("transacciones").insertOne({
        transaccion_id: new ObjectId(),
        cuenta_origen: cuenta,
        cuenta_destino: cuenta,
        monto: Number(monto),
        tipo: "Deposito",
        descripcion: "Depósito realizado",
        fecha_hora: new Date(),
        estado: "aprobada",
      });

      res.json({
        message: "Depósito realizado",
        saldo: nuevoSaldo,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  app.post("/api/retiro", async (req, res) => {
    try {
      const { cuenta, monto } = req.body;

      const db = mongoose.connection.db;

      const cuentaEncontrada = await db.collection("cuentas").findOne({
        numero_cuenta: cuenta,
      });

      if (!cuentaEncontrada) {
        return res.status(404).json({
          message: "Cuenta no encontrada",
        });
      }

      if (cuentaEncontrada.saldo < Number(monto)) {
        return res.status(400).json({
          message: "Fondos insuficientes",
        });
      }

      const nuevoSaldo =
        cuentaEncontrada.saldo - Number(monto);

      await db.collection("cuentas").updateOne(
        {
          numero_cuenta: cuenta,
        },
        {
          $set: {
            saldo: nuevoSaldo,
          },
        }
      );

      await db.collection("transacciones").insertOne({
        transaccion_id: new ObjectId(),
        cuenta_origen: cuenta,
        cuenta_destino: cuenta,
        monto: Number(monto),
        tipo: "Retiro",
        descripcion: "Retiro realizado",
        fecha_hora: new Date(),
        estado: "aprobada",
      });

      res.json({
        message: "Retiro realizado",
        saldo: nuevoSaldo,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();