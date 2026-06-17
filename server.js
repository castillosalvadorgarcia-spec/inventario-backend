const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Conexión exitosa a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Esquema NoSQL de Mongoose (Documento JSON)
const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  existencia: Number
});

const Producto = mongoose.model('Producto', ProductoSchema);

// --- RUTAS DE LA API ---

// 1. GET: Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error });
  }
});

// 2. POST: Insertar un nuevo producto
app.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.json({ mensaje: "¡Producto registrado con éxito!", nuevoProducto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar producto", error });
  }
});

// Configuración del Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});