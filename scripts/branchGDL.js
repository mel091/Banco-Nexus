async function operacionSucursalGDL() {
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
          monto: 500,
          sucursal: "GDL",
        }),
      }
    );

    const data = await response.json();
    console.log("GDL:", data);
    return data;
  } catch (error) {
    console.error("Error GDL:", error);
    return { error: error.message, sucursal: "GDL" };
  }
}

module.exports = { operacionSucursalGDL };