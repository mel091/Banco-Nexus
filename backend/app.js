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

  const db = mongoose.connection.db;

  // CONSULTAR CUENTA
  app.get("/api/cuenta/:cuenta", async (req, res) => {
    try {
      const { cuenta } = req.params;

      const cuentaEncontrada = await db
        .collection("cuentas")
        .findOne({
          numero_cuenta: cuenta,
        });

      if (!cuentaEncontrada) {
        return res.status(404).json({
          message: "Cuenta no encontrada",
        });
      }

      const cliente = await db
        .collection("clientes")
        .findOne({
          cliente_id: cuentaEncontrada.cliente_id,
        });

      const transacciones = await db
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
        .toArray();

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
      res.status(500).json({
        message: error.message,
      });
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
          }
        );

      if (!resultado) {
        return res.status(404).json({
          message: "Cuenta no encontrada",
        });
      }

      await db
        .collection("transacciones")
        .insertOne({
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
        });

      res.json({
        message: "Depósito realizado",
        saldo: resultado.saldo,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
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
          }
        );

      if (!resultado) {
        return res.status(400).json({
          message:
            "Fondos insuficientes o cuenta no encontrada",
        });
      }

      await db
        .collection("transacciones")
        .insertOne({
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
        });

      res.json({
        message: "Retiro realizado",
        saldo: resultado.saldo,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
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