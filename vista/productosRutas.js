const express = require('express');
const router = express.Router();
const { leerProductos, guardarProductos } = require('../modelo/directorio');

//------------------------------------------------
//productos
// ============================================
// 2. CONSULTAR USUARIO POR ID (GET)
// ============================================
router.get('/articulos/:id', async (req, res) => {

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
router.get('/producto/descripcion/:descripcion', async (req, res) => {

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

router.get('/producto/estado/:estado', async (req, res) => {

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
router.post('/productos', async (req,res)=>{


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
router.put('/productos/:id', async (req, res) => {
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
router.patch('/productos/editar/:id', async(req, res) => {

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
router.delete('/productos/eliminar/:id', async (req, res) => {
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

module.exports = router;
