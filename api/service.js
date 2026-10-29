/**
 * Serverless Function - Proxy Seguro de API
 * Lee las variables de entorno configuradas y reenvía las solicitudes
 * al servidor central, garantizando que todo dato de texto se almacene en MAYÚSCULAS.
 */

function convertStringsToUppercase(obj) {
  if (typeof obj === "string") {
    // Conservar URLs y base64 intactos para no alterar enlaces de imágenes
    if (obj.startsWith("http://") || obj.startsWith("https://") || obj.startsWith("data:image/")) {
      return obj;
    }
    return obj.trim().toUpperCase();
  }
  if (Array.isArray(obj)) {
    return obj.map(convertStringsToUppercase);
  }
  if (obj !== null && typeof obj === "object") {
    const newObj = {};
    for (const [key, val] of Object.entries(obj)) {
      newObj[key] = convertStringsToUppercase(val);
    }
    return newObj;
  }
  return obj;
}

module.exports = async (req, res) => {
  // Variable de entorno en el servidor (con respaldo seguro)
  const backendUrl = process.env.BACKEND_API_URL || "https://script.google.com/macros/s/AKfycbyzY0V73VNkkrrHRwxCu_z2bSwmnEEDnEbjQwu81R4GYZLYHp3uo66vYgWDICAPinLR/exec";

  // Habilitar cabeceras institucionales
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let targetUrl = backendUrl;
    let fetchOptions = {
      method: req.method,
      redirect: "follow"
    };

    if (req.method === "GET") {
      const urlObj = new URL(backendUrl);
      if (req.query) {
        for (const [key, val] of Object.entries(req.query)) {
          urlObj.searchParams.set(key, val);
        }
      }
      targetUrl = urlObj.toString();
    } else {
      fetchOptions.headers = { "Content-Type": "text/plain;charset=utf-8" };
      let bodyData = req.body;
      if (typeof bodyData === "string") {
        try {
          bodyData = JSON.parse(bodyData);
        } catch (e) {}
      }

      // Forzar conversión de todos los datos a MAYÚSCULAS respetando el nombre de la acción
      if (bodyData && typeof bodyData === "object") {
        if (bodyData.data && typeof bodyData.data === "object") {
          bodyData.data = convertStringsToUppercase(bodyData.data);
        } else {
          const action = bodyData.action;
          const sheetName = bodyData.sheetName;
          bodyData = convertStringsToUppercase(bodyData);
          if (action) bodyData.action = action;
          if (sheetName) bodyData.sheetName = sheetName;
        }
      }

      fetchOptions.body = JSON.stringify(bodyData);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error en proxy de API:", error);
    return res.status(500).json({
      status: "error",
      message: "Error de comunicación con el servidor central: " + error.toString()
    });
  }
};
