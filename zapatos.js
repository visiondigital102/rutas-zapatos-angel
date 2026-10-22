const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 5055;
//const FILE_PATH = path.resolve('./data.json');
//const PRODUCT_FILE_PATH = path.resolve('./producto.json');
const clienterouter = require ('./vista/clientesRutas');
const productorouter = require ('./vista/productosRutas');
app.use(express.json());


app.use('/clientes', clienterouter)
app.use('/productos', productorouter)
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
