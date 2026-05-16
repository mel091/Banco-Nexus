async function operacionSucursalTIJ() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/retiro",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cuenta: "4152314600875820",
          monto: 300,
          sucursal: "TIJ",
        }),
      }
    );

    const data = await response.json();
    console.log("TIJ:", data);
    return data;
  } catch (error) {
    console.error("Error TIJ:", error);
    return { error: error.message, sucursal: "TIJ" };
  }
}

module.exports = { operacionSucursalTIJ };