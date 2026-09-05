const express = require('express');
const CarritoCompras = require('./CarritoCompras');

const app = express();
const carrito = new CarritoCompras();

app.use(express.json());

app.get('/productos', (req, res) => {
    res.json(carrito.listar());
});

app.post('/productos', (req, res) => {
    try {
        const resultado = carrito.agregar(req.body);
        res.status(resultado.creado ? 201 : 200).json(resultado.producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/productos/:id', (req, res) => {
    try {
        const producto = carrito.actualizarCantidad(req.params.id, req.body.cantidad);
        res.json(producto);
    } catch (error) {
        const estado = error.code === 'NOT_FOUND' ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
});

app.delete('/productos/:id', (req, res) => {
    try {
        carrito.eliminar(req.params.id);
        res.status(204).send();
    } catch (error) {
        const estado = error.code === 'NOT_FOUND' ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
});

app.get('/carrito/total', (req, res) => {
    res.json({ total: carrito.calcularTotal() });
});

app.post('/carrito/aplicar-descuento', (req, res) => {
    try {
        res.json(carrito.aplicarDescuento(req.body.porcentaje));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud no contiene JSON válido' });
    }

    return next(error);
});

if (require.main === module) {
    const puerto = Number(process.env.PORT) || 3000;
    app.listen(puerto, () => console.log(`Servidor en el puerto ${puerto}`));
}

module.exports = { app, carrito };


