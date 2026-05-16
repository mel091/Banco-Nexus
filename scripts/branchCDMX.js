async function operacionSucursalCDMX() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/deposito",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cuenta: "4152314600875820",
          monto: 1000,
          sucursal: "CDMX",
        }),
      }
    );

    const data = await response.json();
    console.log("CDMX:", data);
    return data;
  } catch (error) {
    console.error("Error CDMX:", error);
    return { error: error.message, sucursal: "CDMX" };
  }
}

module.exports = { operacionSucursalCDMX };