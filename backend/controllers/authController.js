import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import Client from '../models/Client.js';
import Account from '../models/Account.js';
import { logEvent } from '../middleware/auditMiddleware.js';
import { generateAccountNumberBase } from '../utils/accountUtils.js';

const generateAccountNumber = async () => {
  let isUnique = false;
  let newNumber = '';
  let count = (await Account.countDocuments()) + 1;
  while (!isUnique) {
    newNumber = generateAccountNumberBase(count);
    const existing = await Account.findOne({ numero_cuenta: newNumber });
    if (!existing) {
      isUnique = true;
    } else {
      count++;
    }
  }
  return newNumber;
};

export const registerUser = async (req, res) => {
  try {
    const { nombre, curp, telefono, email, password } = req.body;

    const userExists = await Client.findOne({ $or: [{ email }, { curp }] });

    if (userExists) {
      await logEvent(null, 'registro_fallido', 'fallido', { error: 'Usuario ya existe', email, curp });
      return res.status(400).json({ message: 'Usuario con este email o CURP ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const cliente_id = new ObjectId();
    const client = await Client.create({
      cliente_id,
      nombre,
      curp,
      telefono,
      email,
      password: hashedPassword
    });

    if (client) {
      const numero_cuenta = await generateAccountNumber();
      const account = await Account.create({
        cuenta_id: new ObjectId(),
        cliente_id: client.cliente_id,
        numero_cuenta,
        tipo: 'Debito',
        saldo: 0,
        estado: 'activa'
      });

      await logEvent(client.cliente_id, 'registro_exitoso', 'exitoso', { cuenta_asignada: numero_cuenta });

      res.status(201).json({
        cliente_id: client.cliente_id,
        nombre: client.nombre,
        email: client.email,
        numero_cuenta: account.numero_cuenta,
        token: generateToken(client.cliente_id)
      });
    } else {
      await logEvent(null, 'registro_fallido', 'fallido', { error: 'Datos inválidos' });
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error(error);
    await logEvent(null, 'registro_fallido', 'fallido', { error: error.message });
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Client.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      await logEvent(user.cliente_id, 'login_exitoso', 'exitoso', { email });
      res.json({
        cliente_id: user.cliente_id,
        nombre: user.nombre,
        email: user.email,
        token: generateToken(user.cliente_id)
      });
    } else {
      await logEvent(user ? user.cliente_id : null, 'login_fallido', 'fallido', { email });
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await Client.findOne({ cliente_id: req.user.cliente_id }).select('-password');
    if (user) {
      const account = await Account.findOne({ cliente_id: user.cliente_id });
      res.json({
        ...user._doc,
        cuenta: account ? {
          numero_cuenta: account.numero_cuenta,
          tipo: account.tipo,
          saldo: account.saldo,
          estado: account.estado
        } : null
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const generateToken = (id) => {
  return jwt.sign({ cliente_id: id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
