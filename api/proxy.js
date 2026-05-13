// api/proxy.js - Proxy CORS para Google Apps Script

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbySF8N9fCVykDc1zjS1O4R_1t2-bsGxzP7TnJBGFGQjp-XJpMKKKnXszWhPMZaCRch_PQ/exec";

export default async function handler(req, res) {
  // Configurar cabeceras CORS (esto sí funciona en Vercel)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Construir la URL del script de Google
    let url = GOOGLE_SCRIPT_URL;
    let options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (req.method === "GET") {
      // Pasar los parámetros de consulta
      const params = new URLSearchParams(req.query);
      url += "?" + params.toString();
    } else if (req.method === "POST") {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}