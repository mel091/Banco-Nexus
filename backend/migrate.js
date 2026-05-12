import dotenv from "dotenv";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import connectDB from "./config/database.js";

dotenv.config();

async function crearBaseDeDatos() {
	try {
		await connectDB();

		console.log("✅ Conectado a MongoDB");

		const db = mongoose.connection.db;

		await db.collection("clientes").deleteMany({});
		await db.collection("cuentas").deleteMany({});
		await db.collection("transacciones").deleteMany({});

		const clientes = [
			{
				cliente_id: new ObjectId(),
				nombre: "Amy Martinez García",
				curp: "MAGA010203HBCRRN01",
				telefono: "6121234567",
				email: "amy@gmail.com",
				fecha_registro: new Date(),
				estado: true,
            },
			{
				cliente_id: new ObjectId(),
				nombre: "Natanael Heraldez Gaxiola",
				curp: "HEGN990101MBCPRS02",
				telefono: "6129876543",
				email: "natanael@gmail.com",
				fecha_registro: new Date(),
				estado: true,
            },
			{
				cliente_id: new ObjectId(),
				nombre: "Andres Ramírez Sánchez",
				curp: "RASA950505HBCRTL03",
				telefono: "6124567890",
				email: "andres@gmail.com",
				fecha_registro: new Date(),
				estado: true,
            },
			{
				cliente_id: new ObjectId(),
				nombre: "Carmen Soto Ortega",
				curp: "SOOC980808MBCNTN04",
				telefono: "6126543210",
				email: "carmen@gmail.com",
				fecha_registro: new Date(),
				estado: true,
            },
			{
				cliente_id: new ObjectId(),
				nombre: "Omar Rivera Navarrete",
				curp: "RINO920202HBCRGS05",
				telefono: "6121112233",
				email: "omar@gmail.com",
				fecha_registro: new Date(),
				estado: true,
            },
		];

		await db.collection("clientes").insertMany(clientes);

		console.log("✅ Clientes insertados");

		const cuentas = [
			{
				cuenta_id: new ObjectId(),
				cliente_id: clientes[0].cliente_id,
				numero_cuenta: "4152314600875820",
				tipo: "Debito",
				saldo: 12500,
				estado: "activa",
				fechaCreacion: new Date(),
			},
			{
				cuenta_id: new ObjectId(),
				cliente_id: clientes[1].cliente_id,
				numero_cuenta: "4539148803436467",
				tipo: "Ahorro",
				saldo: 8500,
				estado: "activa",
				fechaCreacion: new Date(),
			},
			{
				cuenta_id: new ObjectId(),
				cliente_id: clientes[2].cliente_id,
				numero_cuenta: "4716902311452201",
				tipo: "Debito",
				saldo: 15400,
				estado: "activa",
				fechaCreacion: new Date(),
			},
			{
				cuenta_id: new ObjectId(),
				cliente_id: clientes[3].cliente_id,
				numero_cuenta: "4024781299003312",
				tipo: "Ahorro",
				saldo: 7200,
				estado: "activa",
				fechaCreacion: new Date(),
			},
			{
				cuenta_id: new ObjectId(),
				cliente_id: clientes[4].cliente_id,
				numero_cuenta: "4485672155001199",
				tipo: "Debito",
				saldo: 9800,
				estado: "activa",
				fechaCreacion: new Date(),
			},
		];

		await db.collection("cuentas").insertMany(cuentas);

		console.log("✅ Cuentas insertadas");

		const transacciones = [
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[0].numero_cuenta,
				cuenta_destino: cuentas[1].numero_cuenta,
				monto: 5000,
				tipo: "Deposito",
				descripcion: "Pago de nómina",
				fecha_hora: new Date("2026-05-01"),
				estado: "aprobada",
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[0].numero_cuenta,
				cuenta_destino: cuentas[3].numero_cuenta,
				monto: 1000,
				tipo: "Retiro",
				descripcion: "Retiro ATM",
				fecha_hora: new Date("2026-05-03"),
				estado: "aprobada",
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[0].numero_cuenta,
				cuenta_destino: cuentas[2].numero_cuenta,
				monto: 3500,
				tipo: "Deposito",
				descripcion: "Transferencia",
				fecha_hora: new Date("2026-05-05"),
				estado: "aprobada",
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[1].numero_cuenta,
				cuenta_destino: cuentas[0].numero_cuenta,
				tipo: "Deposito",
				monto: 8500,
				descripcion: "Ahorro inicial",
				fecha_hora: new Date("2026-05-02"),
				estado: "aprobada",
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[2].numero_cuenta,
				cuenta_destino: cuentas[4].numero_cuenta,
				tipo: "Deposito",
				monto: 15400,
				descripcion: "Pago",
				fecha_hora: new Date("2026-05-01"),
				estado: "aprobada",
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[3].numero_cuenta,
				cuenta_destino: cuentas[1].numero_cuenta,
				tipo: "Deposito",
				monto: 7200,
				descripcion: "Transferencia",
				fecha_hora: new Date("2026-05-04"),
				estado: "aprobada",
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[4].numero_cuenta,
				cuenta_destino: cuentas[2].numero_cuenta,
				tipo: "Deposito",
				monto: 9800,
				descripcion: "Pago",
				fecha_hora: new Date("2026-05-06"),
				estado: "aprobada",
			},
		];

		await db.collection("transacciones").insertMany(transacciones);

		console.log("Transacciones insertadas");

		console.log("Base de datos Banco Nexus creada correctamente");
	} catch (error) {
		console.error("Error:", error);
	} finally {
		await mongoose.connection.close();
		console.log("Conexión cerrada");
	}
}

crearBaseDeDatos();