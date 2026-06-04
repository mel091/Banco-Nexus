import dotenv from "dotenv";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import connectDB from "./config/database.js";
import bcrypt from "bcryptjs";

dotenv.config();

const majorityWriteConcern = {
  writeConcern: {
    w: "majority",
    j: true,
  },
};

async function verificarIntegridad(
  db,
  clientes,
  cuentas,
  transacciones
) {
  const [clientesPersistidos, cuentasPersistidas, transaccionesPersistidas] =
    await Promise.all([
      db.collection("clientes").countDocuments({}),
      db.collection("cuentas").countDocuments({}),
      db.collection("transacciones").countDocuments({}),
    ]);

  if (
    clientesPersistidos !== clientes.length ||
    cuentasPersistidas !== cuentas.length ||
    transaccionesPersistidas !== transacciones.length
  ) {
    throw new Error(
      `Integridad inválida: se esperaban ${clientes.length}/${cuentas.length}/${transacciones.length} documentos y se obtuvieron ${clientesPersistidos}/${cuentasPersistidas}/${transaccionesPersistidas}`
    );
  }

  const clientesPorId = new Set(
    clientes.map((cliente) => cliente.cliente_id.toString())
  );

  const cuentasPorNumero = new Set(
    cuentas.map((cuenta) => cuenta.numero_cuenta)
  );

  for (const cuenta of cuentas) {
    if (!clientesPorId.has(cuenta.cliente_id.toString())) {
      throw new Error(
        `Integridad inválida: la cuenta ${cuenta.numero_cuenta} no referencia un cliente existente`
      );
    }
  }

  for (const transaccion of transacciones) {
    const origenValido =
      transaccion.cuenta_origen === "EFECTIVO" ||
      cuentasPorNumero.has(transaccion.cuenta_origen);

    const destinoValido =
      transaccion.cuenta_destino === "EFECTIVO" ||
      cuentasPorNumero.has(transaccion.cuenta_destino);

    if (!origenValido || !destinoValido) {
      throw new Error(
        `Integridad inválida: la transacción ${transaccion.transaccion_id.toString()} contiene referencias huérfanas`
      );
    }
  }

  return {
    clientesPersistidos,
    cuentasPersistidas,
    transaccionesPersistidas,
  };
}

async function crearBaseDeDatos() {
  try {
    await connectDB();

    console.log("MongoDB connected");

    const db = mongoose.connection.db;

    // Limpiar colecciones
    await db.collection("clientes").deleteMany({}, majorityWriteConcern);

    await db.collection("cuentas").deleteMany({}, majorityWriteConcern);

    await db
      .collection("transacciones")
      .deleteMany({}, majorityWriteConcern);

    // Índice único
    await db.collection("cuentas").createIndex(
      {
        numero_cuenta: 1,
      },
      {
        unique: true,
        writeConcern: majorityWriteConcern.writeConcern,
      }
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("secret", salt);

    // CLIENTES
    const clientes = [
      {
        cliente_id: new ObjectId(),
        nombre: "Amy Martinez García",
        curp: "MAGA010203HBCRRN01",
        telefono: "6121234567",
        email: "amy@gmail.com",
        password: hashedPassword,
        fecha_registro: new Date(),
        estado: true,
      },

      {
        cliente_id: new ObjectId(),
        nombre: "Natanael Heraldez Gaxiola",
        curp: "HEGN990101MBCPRS02",
        telefono: "6129876543",
        email: "natanael@gmail.com",
        password: hashedPassword,
        fecha_registro: new Date(),
        estado: true,
      },

      {
        cliente_id: new ObjectId(),
        nombre: "Andres Ramírez Sánchez",
        curp: "RASA950505HBCRTL03",
        telefono: "6124567890",
        email: "andres@gmail.com",
        password: hashedPassword,
        fecha_registro: new Date(),
        estado: true,
      },

      {
        cliente_id: new ObjectId(),
        nombre: "Carmen Soto Ortega",
        curp: "SOOC980808MBCNTN04",
        telefono: "6126543210",
        email: "carmen@gmail.com",
        password: hashedPassword,
        fecha_registro: new Date(),
        estado: true,
      },

      {
        cliente_id: new ObjectId(),
        nombre: "Omar Rivera Navarrete",
        curp: "RINO920202HBCRGS05",
        telefono: "6121112233",
        email: "omar@gmail.com",
        password: hashedPassword,
        fecha_registro: new Date(),
        estado: true,
      },
    ];

    await db
      .collection("clientes")
      .insertMany(clientes, majorityWriteConcern);

    console.log("Clientes insertados");

    // CUENTAS
    const cuentas = [
      {
        cuenta_id: new ObjectId(),
        cliente_id: clientes[0].cliente_id,
        numero_cuenta: "1800000010",
        tipo: "Debito",
        saldo: 12500,
        estado: "activa",
        fechaCreacion: new Date(),
      },

      {
        cuenta_id: new ObjectId(),
        cliente_id: clientes[1].cliente_id,
        numero_cuenta: "1800000021",
        tipo: "Ahorro",
        saldo: 8500,
        estado: "activa",
        fechaCreacion: new Date(),
      },

      {
        cuenta_id: new ObjectId(),
        cliente_id: clientes[2].cliente_id,
        numero_cuenta: "1800000032",
        tipo: "Debito",
        saldo: 15400,
        estado: "activa",
        fechaCreacion: new Date(),
      },

      {
        cuenta_id: new ObjectId(),
        cliente_id: clientes[3].cliente_id,
        numero_cuenta: "1800000043",
        tipo: "Ahorro",
        saldo: 7200,
        estado: "activa",
        fechaCreacion: new Date(),
      },

      {
        cuenta_id: new ObjectId(),
        cliente_id: clientes[4].cliente_id,
        numero_cuenta: "1800000054",
        tipo: "Debito",
        saldo: 9800,
        estado: "activa",
        fechaCreacion: new Date(),
      },
    ];

    await db
      .collection("cuentas")
      .insertMany(cuentas, majorityWriteConcern);

    console.log("Cuentas insertadas");

    // TRANSACCIONES
    const transacciones = [
      {
        transaccion_id: new ObjectId(),
        cuenta_origen: "EFECTIVO",
        cuenta_destino: cuentas[0].numero_cuenta,
        monto: 5000,
        tipo: "Deposito",
        descripcion: "Pago de nómina",
        sucursal: "CDMX",
        fecha_hora: new Date("2026-05-01"),
        estado: "aprobada",
      },

      {
        transaccion_id: new ObjectId(),
        cuenta_origen: cuentas[0].numero_cuenta,
        cuenta_destino: "EFECTIVO",
        monto: 1000,
        tipo: "Retiro",
        descripcion: "Retiro ATM",
        sucursal: "GDL",
        fecha_hora: new Date("2026-05-03"),
        estado: "aprobada",
      },

      {
        transaccion_id: new ObjectId(),
        cuenta_origen: cuentas[0].numero_cuenta,
        cuenta_destino: cuentas[2].numero_cuenta,
        monto: 3500,
        tipo: "Transferencia",
        descripcion: "Transferencia SPEI",
        sucursal: "MTY",
        fecha_hora: new Date("2026-05-05"),
        estado: "aprobada",
      },

      {
        transaccion_id: new ObjectId(),
        cuenta_origen: "EFECTIVO",
        cuenta_destino: cuentas[1].numero_cuenta,
        monto: 8500,
        tipo: "Deposito",
        descripcion: "Ahorro inicial",
        sucursal: "LPZ",
        fecha_hora: new Date("2026-05-02"),
        estado: "aprobada",
      },

      {
        transaccion_id: new ObjectId(),
        cuenta_origen: "EFECTIVO",
        cuenta_destino: cuentas[2].numero_cuenta,
        monto: 15400,
        tipo: "Deposito",
        descripcion: "Pago recibido",
        sucursal: "CDMX",
        fecha_hora: new Date("2026-05-01"),
        estado: "aprobada",
      },

      {
        transaccion_id: new ObjectId(),
        cuenta_origen: cuentas[3].numero_cuenta,
        cuenta_destino: cuentas[1].numero_cuenta,
        monto: 7200,
        tipo: "Transferencia",
        descripcion: "Transferencia bancaria",
        sucursal: "GDL",
        fecha_hora: new Date("2026-05-04"),
        estado: "aprobada",
      },

      {
        transaccion_id: new ObjectId(),
        cuenta_origen: cuentas[4].numero_cuenta,
        cuenta_destino: "EFECTIVO",
        monto: 9800,
        tipo: "Retiro",
        descripcion: "Retiro ventanilla",
        sucursal: "TIJ",
        fecha_hora: new Date("2026-05-06"),
        estado: "aprobada",
      },
    ];

    await db
      .collection("transacciones")
      .insertMany(transacciones, majorityWriteConcern);

    console.log("Transacciones insertadas");

    const integridad = await verificarIntegridad(
      db,
      clientes,
      cuentas,
      transacciones
    );

    console.log(
      `Integridad verificada: ${integridad.clientesPersistidos} clientes, ${integridad.cuentasPersistidas} cuentas y ${integridad.transaccionesPersistidas} transacciones replicadas correctamente`
    );

    console.log("Base de datos Banco Nexus creada correctamente");
  } catch (error) {
    console.error("Error:", error.message);

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();

    console.log("Conexión cerrada");
  }
}

crearBaseDeDatos();