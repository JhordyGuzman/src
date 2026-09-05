class CarritoCompras {
    constructor() {
        this.productos = [];
    }

    listar() {
        return this.productos;
    }

    agregar({ id, nombre, precio, cantidad } = {}) {
        this.#validarId(id);
        this.#validarTexto(nombre, 'nombre');
        this.#validarNumeroPositivo(precio, 'precio');
        this.#validarNumeroPositivo(cantidad, 'cantidad');

        const existente = this.productos.find((producto) => producto.id === id);

        if (existente) {
            existente.cantidad += cantidad;
            return { producto: existente, creado: false };
        }

        const producto = { id, nombre: nombre.trim(), precio, cantidad };
        this.productos.push(producto);
        return { producto, creado: true };
    }

    actualizarCantidad(idRecibido, cantidad) {
        const id = this.#normalizarId(idRecibido);
        this.#validarNumeroPositivo(cantidad, 'cantidad');

        const producto = this.productos.find((item) => item.id === id);
        if (!producto) {
            throw this.#errorNoEncontrado(id);
        }

        producto.cantidad = cantidad;
        return producto;
    }

    eliminar(idRecibido) {
        const id = this.#normalizarId(idRecibido);
        const indice = this.productos.findIndex((producto) => producto.id === id);

        if (indice === -1) {
            throw this.#errorNoEncontrado(id);
        }

        return this.productos.splice(indice, 1)[0];
    }

    calcularTotal() {
        const total = this.productos.reduce(
            (acumulado, producto) => acumulado + producto.precio * producto.cantidad,
            0,
        );

        return this.#redondear(total);
    }

    aplicarDescuento(porcentaje) {
        if (typeof porcentaje !== 'number' || !Number.isFinite(porcentaje)) {
            throw new Error('porcentaje debe ser un número');
        }

        if (porcentaje < 0 || porcentaje > 50) {
            throw new Error('porcentaje debe estar entre 0 y 50');
        }

        const total = this.calcularTotal();
        const totalConDescuento = this.#redondear(total * (1 - porcentaje / 100));

        return { total, porcentaje, totalConDescuento };
    }

    #normalizarId(id) {
        const idNumerico = typeof id === 'string' && id.trim() !== '' ? Number(id) : id;
        this.#validarId(idNumerico);
        return idNumerico;
    }

    #validarId(id) {
        if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
            throw new Error('id debe ser un número entero positivo');
        }
    }

    #validarTexto(valor, campo) {
        if (typeof valor !== 'string' || valor.trim() === '') {
            throw new Error(`${campo} es obligatorio`);
        }
    }

    #validarNumeroPositivo(valor, campo) {
        if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
            throw new Error(`${campo} debe ser un número positivo`);
        }
    }

    #errorNoEncontrado(id) {
        const error = new Error(`No existe un producto con id ${id}`);
        error.code = 'NOT_FOUND';
        return error;
    }

    #redondear(valor) {
        return Math.round((valor + Number.EPSILON) * 100) / 100;
    }
}

module.exports = CarritoCompras;
