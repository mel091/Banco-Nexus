const { operacionSucursalCDMX } = require('./branchCDMX.js');
const { operacionSucursalGDL } = require('./branchGDL.js');
const { operacionSucursalLPZ } = require('./branchLPZ.js');
const { operacionSucursalTIJ } = require('./branchTIJ.js');
const { operacionSucursalMTY } = require('./branchMTY.js');

async function ejecutarPrueba() {
  console.log("Ejecutando operaciones ----------------------------------");
  
  const resultados = await Promise.all([
    operacionSucursalCDMX(),
    operacionSucursalGDL(),
    operacionSucursalLPZ(),
    operacionSucursalTIJ(),
    operacionSucursalMTY(),
  ]);
  
  const response = await fetch("http://localhost:3000/api/cuenta/4152314600875820");
  const datosCuenta = await response.json();
  console.log("Saldo final:", datosCuenta.saldo);
}

ejecutarPrueba();