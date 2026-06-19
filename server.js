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
  .then(() => console.log("🔥 Conexión exitosa a MongoDB Atlas (Inventario CRUD)"))
  .catch(err => console.error("❌ Error de conexión:", err));

// 3. ESQUEMA Y MODELO
const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  existencia: Number
});

const Producto = mongoose.model('Producto', ProductoSchema);

// 4. RUTAS DE LA API (CRUD COMPLETO)

// READ: Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error });
  }
});

// CREATE: Registrar un nuevo producto
app.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.json({ mensaje: "¡Producto registrado con éxito!", nuevoProducto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar producto", error });
  }
});

// UPDATE: Modificar un producto existente por su ID
app.put('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ mensaje: "¡Producto actualizado con éxito!", productoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el producto", error });
  }
});

// DELETE: Eliminar un producto por su ID
app.delete('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Producto.findByIdAndDelete(id);
    res.json({ mensaje: "¡Producto eliminado con éxito!" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el producto", error });
  }
});

// 5. ARRANQUE DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});