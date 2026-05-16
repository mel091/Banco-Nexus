async function operacionSucursalMTY() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/cuenta/4152314600875820"
    );

    const data = await response.json();
    
    // Mostrar solo lo importante, no todas las transacciones
    console.log("MTY:", {
      cliente: data.cliente,
      numero_cuenta: data.numero_cuenta,
      saldo: data.saldo,
      tipo: data.tipo,
      estado: data.estado,
      total_transacciones: data.transacciones?.length || 0
    });
    
    return data;
  } catch (error) {
    console.error("Error MTY:", error);
    return { error: error.message, sucursal: "MTY" };
  }
}

module.exports = { operacionSucursalMTY };