import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://root:secret@localhost:27017";
const client = new MongoClient(uri);

async function crearBaseDeDatos() {
	try {
		await client.connect();

		console.log("✅ Conectado a MongoDB");

		const db = client.db("banco_nexus");

		await db.collection("clientes").deleteMany({});
		await db.collection("cuentas").deleteMany({});
		await db.collection("transacciones").deleteMany({});

		const clientes = [
			{
				cliente_id: new ObjectId(),
				nombre: "Juan Pérez García",
				curp: "PEGJ010203HBCRRN01",
				telefono: "6121234567",
				email: "juan@gmail.com",
                fechaRegistro: new Date(),
                activo: true,
            },
			{
				cliente_id: new ObjectId(),
				nombre: "María López Torres",
				curp: "LOTM990101MBCPRS02",
				telefono: "6129876543",
				email: "maria@gmail.com",
                fechaRegistro: new Date(),
                activo: true,
            },
			{
				cliente_id: new ObjectId(),
				nombre: "Carlos Ramírez Soto",
				curp: "RASC950505HBCRTL03",
				telefono: "6124567890",
				email: "carlos@gmail.com",
                fechaRegistro: new Date(),
                activo: true,
            },
			{
				cliente_id: new ObjectId(),
				nombre: "Ana Martínez Ruiz",
				curp: "MARA980808MBCNTN04",
				telefono: "6126543210",
				email: "ana@gmail.com",
                fechaRegistro: new Date(),
                activo: true,
            },
			{
				cliente_id: new ObjectId(),
				nombre: "Luis Hernández Vega",
				curp: "HEVL920202HBCRGS05",
				telefono: "6121112233",
				email: "luis@gmail.com",
                fechaRegistro: new Date(),
                activo: true,
            },
		];
		await db.collection("clientes").insertMany(clientes);

		console.log("✅ Clientes insertados");

		const cuentas = [
			{
				cuenta_id: new ObjectId(),
				clienteId: clientes[0].cliente_id,
				numeroCuenta: "4152 3146 0087 5820",
				tipoCuenta: "Debito",
				saldo: 12500,
				activa: true,
				fechaCreacion: new Date(),
			},
			{
				cuenta_id: new ObjectId(),
				clienteId: clientes[1].cliente_id,
				numeroCuenta: "4539 1488 0343 6467",
				tipoCuenta: "Ahorro",
				saldo: 8500,
				activa: true,
				fechaCreacion: new Date(),
			},
			{
				cuenta_id: new ObjectId(),
				clienteId: clientes[2].cliente_id,
				numeroCuenta: "4716 9023 1145 2201",
				tipoCuenta: "Debito",
				saldo: 15400,
				activa: true,
				fechaCreacion: new Date(),
			},
			{
				cuenta_id: new ObjectId(),
				clienteId: clientes[3].cliente_id,
				numeroCuenta: "4024 7812 9900 3312",
				tipoCuenta: "Ahorro",
				saldo: 7200,
				activa: true,
				fechaCreacion: new Date(),
			},
			{
				cuenta_id: new ObjectId(),
				clienteId: clientes[4].cliente_id,
				numeroCuenta: "4485 6721 5500 1199",
				tipoCuenta: "Debito",
				saldo: 9800,
				activa: true,
				fechaCreacion: new Date(),
			},
		];

		await db.collection("cuentas").insertMany(cuentas);

		console.log("✅ Cuentas insertadas");

		const transacciones = [
			{
                transaccion_id: new ObjectId(),
                cuenta_origen: cuentas[0].numeroCuenta,
				cuenta_destino: cuentas[0].numeroCuenta,
				monto: 5000,
				tipo: "Deposito",
				descripcion: "Pago de nómina",
				fecha: new Date("2026-05-01"),
				saldoPosterior: 10000,
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[0].numeroCuenta,
				cuenta_destino: cuentas[0].numeroCuenta,
				monto: 1000,
				tipo: "Retiro",
				descripcion: "Retiro ATM",
				fecha: new Date("2026-05-03"),
				saldoPosterior: 9000,
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[0].numeroCuenta,
				cuenta_destino: cuentas[0].numeroCuenta,
				monto: 3500,
				tipo: "Deposito",
				descripcion: "Transferencia",
				fecha: new Date("2026-05-05"),
				saldoPosterior: 12500,
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[1].numeroCuenta,
				cuenta_destino: cuentas[1].numeroCuenta,
				tipo: "Deposito",
				monto: 8500,
				descripcion: "Ahorro inicial",
				fecha: new Date("2026-05-02"),
				saldoPosterior: 8500,
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[2].numeroCuenta,
				cuenta_destino: cuentas[2].numeroCuenta,
				tipo: "Deposito",
				monto: 15400,
				descripcion: "Pago",
				fecha: new Date("2026-05-01"),
				saldoPosterior: 15400,
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[3].numeroCuenta,
				cuenta_destino: cuentas[3].numeroCuenta,
				tipo: "Deposito",
				monto: 7200,
				descripcion: "Transferencia",
				fecha: new Date("2026-05-04"),
				saldoPosterior: 7200,
			},
			{
                transaccion_id: new ObjectId(),
				cuenta_origen: cuentas[4].numeroCuenta,
				cuenta_destino: cuentas[4].numeroCuenta,
				tipo: "Deposito",
				monto: 9800,
				descripcion: "Pago",
				fecha: new Date("2026-05-06"),
				saldoPosterior: 9800,
			},
		];

		await db.collection("transacciones").insertMany(transacciones);

		console.log("Transacciones insertadas");

		console.log("Base de datos Banco Nexus creada correctamente");
	} catch (error) {
		console.error("Error:", error);
	} finally {
		await client.close();
		console.log("Conexión cerrada");
	}
}

crearBaseDeDatos();
