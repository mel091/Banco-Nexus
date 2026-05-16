async function operacionSucursalLPZ() {
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
          monto: 700,
          sucursal: "LPZ",
        }),
      }
    );

    const data = await response.json();
    console.log("LPZ:", data);
    return data;
  } catch (error) {
    console.error("Error LPZ:", error);
    return { error: error.message, sucursal: "LPZ" };
  }
}

module.exports = { operacionSucursalLPZ };