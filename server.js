const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. MIDDLEWARES
app.use(express.json());
app.use(cors());

// 2. CONEXIÓN A MONGO DB ATLAS
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Conexión exitosa a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// 3. ESQUEMA Y MODELO
const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  existencia: Number
});

const Producto = mongoose.model('Producto', ProductoSchema);

// 4. RUTAS DE LA API
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error });
  }
});

app.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.json({ mensaje: "¡Producto registrado con éxito!", nuevoProducto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar producto", error });
  }
});

// 5. ARRANQUE DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});