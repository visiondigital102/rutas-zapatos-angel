const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 5055;
const FILE_PATH = path.resolve('./data.json');
const PRODUCT_FILE_PATH = path.resolve('./producto.json');
app.use(express.json());

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
//---------------------------------------------
//  clientes
// ============================================
// 1. CONSULTAR TODOS LOS USUARIOS (GET)
// ============================================
app.get('/clientes', async (req, res) => {
    const clientes = await leerDatos();
    res.json(clientes);
});

// ============================================
// 2. CONSULTAR USUARIO POR ID (GET)
// ============================================
app.get('/clientes/:id', async (req, res) => {
    const clientes = await leerDatos();
    const cliente = clientes.find(u => u.id === parseInt(req.params.id));
    
    if (!cliente) {
        return res.status(404).json({ error: 'cliente no encontrado' });
    }
    
    res.json(cliente);
});
app.get('/cliente/nombre/:nombre', async (req, res) => {

    const clientes = await leerDatos();
    const nombreBuscar = req.params.nombre.toLowerCase();

    const resultado = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().startsWith(nombreBuscar)
    );

    if (resultado.length === 0) {
        return res.status(404).json({
            error: 'No se encontraron clientes'
        });
    }

    res.json(resultado);

});
app.get('/cliente/telefono/:telefono', async (req, res) => {

    const tel = await leerDatos();
    const telefonoBuscar = req.params.telefono.toLowerCase();

    const resultado = tel.filter(cliente =>
        cliente.telefono.toLowerCase().startsWith(telefonoBuscar)
    );

    if (resultado.length === 0) {
        return res.status(404).json({
            error: 'No se encontraron teléfonos del cliente'
        });
    }

    res.json(resultado);

});
app.get('/cliente/email/:email', async (req, res) => {

    const correo = await leerDatos();
    const correoBuscar = req.params.email.toLowerCase();

    const resultado = correo.filter(cliente =>
        cliente.email.toLowerCase().startsWith(correoBuscar)
    );

    if (resultado.length === 0) {
        return res.status(404).json({
            error: 'No se encontraron correos del cliente'
        });
    }

    res.json(resultado);

});

// ============================================
// 3. CREAR NUEVO USUARIO (POST)
// ============================================
app.post('/usuarios', async (req,res)=>{


    const {
        nombre,
        telefono,
        direccion,
        email,
        contraseña

    } = req.body;



    if(
        !nombre ||
        !telefono ||
        !direccion ||
        !email ||
        !contraseña
    ){


        return res.status(400).json({

            mensaje:"Todos los campos son obligatorios"

        });


    }




    const usuarios = await leerDatos();




    const nuevoId = usuarios.length > 0

        ? Math.max(...usuarios.map(u=>u.id)) + 1

        : 1;





    const nuevoUsuario = {


        id:nuevoId,

        nombre,

        telefono,

        direccion,

        email,

        contraseña


    };




    usuarios.push(nuevoUsuario);



    await guardarDatos(usuarios);




    res.status(201).json({

        mensaje:"Usuario creado correctamente",

        usuario:nuevoUsuario

    });



});

// ============================================
// 4. ACTUALIZAR USUARIO COMPLETO (PUT)
// ============================================
app.put('/usuarios/:id', async (req, res) => {
    const { nombre, telefono, direccion, email, contraseña } = req.body;
    const id = parseInt(req.params.id);
    
    // Validación
    if (!nombre || !telefono || !direccion || !email || !contraseña) {
        return res.status(400).json({ error: 'Nombre telefono direccion y email son requeridos' });
    }
    
    const usuarios = await leerDatos();
    const indice = usuarios.findIndex(u => u.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Actualizar usuario
    usuarios[indice] = {
        id,
        nombre,
        telefono,
        direccion,
        email,
        contraseña
    };
    
    await guardarDatos(usuarios);
    
    res.json({
        message: 'Usuario actualizado exitosamente',
        usuario: usuarios[indice]
    });
});

// ============================================
// 5. ACTUALIZAR USUARIO PARCIALMENTE (PATCH)
// ============================================
app.patch('/usuarios/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, telefono, direccion, email, contraseña } = req.body;
    
    const usuarios = await leerDatos();
    const indice = usuarios.findIndex(u => u.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Actualizar solo los campos proporcionados
    if (nombre) usuarios[indice].nombre = nombre;
    if (telefono) usuarios[indice].telefono = telefono;
    if (direccion) usuarios[indice].direccion = direccion;
    if (email) usuarios[indice].email = email;
    if (contraseña) usuarios[indice].contraseña = contraseña;
    
    await guardarDatos(usuarios);
    
    res.json({
        message: 'Usuario actualizado parcialmente',
        usuario: usuarios[indice]
    });
});

// ============================================
// 6. ELIMINAR USUARIO (DELETE)
// ============================================
app.delete('/usuarios/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    const usuarios = await leerDatos();
    const indice = usuarios.findIndex(u => u.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Eliminar usuario
    const usuarioEliminado = usuarios.splice(indice, 1);
    await guardarDatos(usuarios);
    
    res.json({
        message: 'Usuario eliminado exitosamente',
        usuario: usuarioEliminado[0]
    });
});

//------------------------------------------------
//productos
// ============================================
// 2. CONSULTAR USUARIO POR ID (GET)
// ============================================
app.get('/articulos/:id', async (req, res) => {

    const productos = await leerProductos();

    const producto = productos.find(
        u => u.id === Number(req.params.id)
    );

    if (!producto) {
        return res.status(404).json({
            error: 'ID de producto no encontrado'
        });
    }

    res.json(producto);

});
app.get('/producto/descripcion/:descripcion', async (req, res) => {

    const descripcion = await leerproductos();
    const descripcionBuscar = req.params.descripcion.toLowerCase();

    const resultado = producto.filter(producto =>
        producto.descripcion.toLowerCase().startsWith(descripcionBuscar)
    );

    if (resultado.length === 0) {
        return res.status(404).json({
            error: 'No se encontraron productos'
        });
    }

    res.json(resultado);

});

app.get('/producto/estado/:estado', async (req, res) => {

    const estado = await leerproductos();
    const estadoBuscar = req.params.estado.toLowerCase();

    const resultado = estado.filter(producto =>
        producto.estado.toLowerCase().startsWith(estadoBuscar)
    );

    if (resultado.length === 0) {
        return res.status(404).json({
            error: 'No se encontraron estados del producto'
        });
    }

    res.json(resultado);

});
// ============================================
// 3. CREAR NUEVO producto (POST)
// ============================================
app.post('/productos', async (req,res)=>{


    const {
        descripcion,
        valorunitario,
        estado
      

    } = req.body;



    if(
        !descripcion ||
        !valorunitario ||
        !estado 
        
    )
    
    {


        return res.status(400).json({

            mensaje:"Todos los campos son obligatorios"

        });


    }




    const productos = await leerProductos();




    const nuevoId = productos.length > 0

        ? Math.max(...productos.map(u=>u.id)) + 1

        : 1;





    const nuevoproducto = {


        id:nuevoId,

        descripcion,

        valorunitario,

        estado



    };




    productos.push(nuevoproducto);



    await guardarProductos(productos);




    res.status(201).json({

        mensaje:"producto creado correctamente",

        producto:nuevoproducto

    });



});
// ============================================
// 4. ACTUALIZAR PRODUCTO COMPLETO (PUT)
// ============================================
app.put('/productos/:id', async (req, res) => {
    const { descripcion, valorunitario, estado } = req.body;
    const id = parseInt(req.params.id);
    
    // Validación
    if (!descripcion || !valorunitario || !estado ) {
        return res.status(400).json({ error: 'descripcion valor unitario y estado son requeridos' });
    }
    
    const productos = await leerProductos();
    const indice = productos.findIndex(u => u.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'producto no encontrado' });
    }
    
    // Actualizar producto
    productos[indice] = {
        id,
        descripcion,
        valorunitario,
        estado
    };
    
    await guardarProductos(productos);
    
    res.json({
        message: 'producto actualizado exitosamente',
        producto: productos[indice]
    });
});
// ===============================
// ACTUALIZAR PRODUCTO PARCIALMENTE
// PATCH
// ===============================
app.patch('/productos/editar/:id', async(req, res) => {

    const id = Number(req.params.id);


    const productos = await leerProductos();


    const indice = productos.findIndex(

        p => p.id === id

    );


    if(indice === -1){

        return res.status(404).json({

            mensaje:"Producto no encontrado"

        });

    }



    const {
        descripcion,
        valorunitario,
        estado
    } = req.body;



    if(descripcion){

        productos[indice].descripcion = descripcion;

    }


    if(valorunitario){

        productos[indice].valorunitario = valorunitario;

    }


    if(estado){

        productos[indice].estado = estado;

    }



    await guardarProductos(productos);



    res.json({

        mensaje:"Producto actualizado parcialmente",

        producto:productos[indice]

    });



});
// ============================================
// 6. ELIMINAR PRODUCTOS (DELETE)
// ============================================
app.delete('/productos/eliminar/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    const productos = await leerProductos();
    const indice = productos.findIndex(u => u.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'producto no encontrado' });
    }
    
    // Eliminar producto
    const productoEliminado = productos.splice(indice, 1);
    await guardarProductos(productos);
    
    res.json({
        message: 'producto eliminado exitosamente',
        producto: productoEliminado[0]
    });
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
