const express = require('express');
const router = express.Router();
const { leerDatos, guardarDatos } = require('../modelo/directorio');

//---------------------------------------------
//  clientes
// ============================================
// 1. CONSULTAR TODOS LOS USUARIOS (GET)
// ============================================
router.get('/todos', async (req, res) => { //localhost:5055/clientes/todos
    const clientes = await leerDatos();
    res.json(clientes);
});

// ============================================
// 2. CONSULTAR USUARIO POR ID (GET)
// ============================================
router.get('/:id', async (req, res) => {
    const clientes = await leerDatos();
    const cliente = clientes.find(u => u.id === parseInt(req.params.id));
    
    if (!cliente) {
        return res.status(404).json({ error: 'cliente no encontrado' });
    }
    
    res.json(cliente);
});
router.get('/cliente/nombre/:nombre', async (req, res) => {

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
router.get('/cliente/telefono/:telefono', async (req, res) => {

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
router.get('/cliente/email/:email', async (req, res) => {

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
router.post('/guardar', async (req,res)=>{


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
router.put('/usuarios/:id', async (req, res) => {
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
router.patch('/usuarios/:id', async (req, res) => {
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
router.delete('/usuarios/:id', async (req, res) => {
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

module.exports = router;

