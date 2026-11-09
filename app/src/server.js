const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/health', (req, res) => {
  res.json({
    estado: 'OK',
    mensaje: 'Servidor Node.js funcionando'
  });
});

app.post('/personas', async (req, res) => {
  const { nombre, ciudad, telefono } = req.body;

  if (!nombre || !ciudad || !telefono) {
    return res.status(400).json({
      error: 'Nombre, ciudad y teléfono son obligatorios'
    });
  }

  try {
    const [resultado] = await pool.execute(
      'INSERT INTO personas (nombre, ciudad, telefono) VALUES (?, ?, ?)',
      [nombre, ciudad, telefono]
    );

    res.status(201).json({
      mensaje: 'Persona registrada correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'No se pudo registrar la persona'
    });
  }
});

app.get('/personas/:telefono', async (req, res) => {
  try {
    const [filas] = await pool.execute(
      'SELECT * FROM personas WHERE telefono = ?',
      [req.params.telefono]
    );

    if (filas.length === 0) {
      return res.status(404).json({
        mensaje: 'Persona no encontrada'
      });
    }

    res.json(filas);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'No se pudo consultar la persona'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
