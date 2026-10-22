const fs = require('fs/promises');
const path = require('path')
const FILE_PATH = path.resolve(__dirname, '../data.json');
const PRODUCT_FILE_PATH = path.resolve(__dirname, '../producto.json');

// ===============================
// LEER DATOS
// ===============================
async function leerDatos() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}
// ===============================
// LEER PRODUCTOS
// ===============================
async function leerProductos() {

    try {

        const data = await fs.readFile(PRODUCT_FILE_PATH, 'utf8');

        return JSON.parse(data);

    } catch (error) {

        return [];

    }

}

// ===============================
// GUARDAR DATOS
// ===============================
async function guardarDatos(datos) {
    await fs.writeFile(FILE_PATH, JSON.stringify(datos, null, 2));
}

// ===============================
// GUARDAR PRODUCTOS
// ===============================
async function guardarProductos(productos) {

    await fs.writeFile(
        PRODUCT_FILE_PATH,
        JSON.stringify(productos, null, 2),
        'utf8'
    );

}
module.exports = {
    leerDatos,
    leerProductos,
    guardarDatos,
    guardarProductos
};
