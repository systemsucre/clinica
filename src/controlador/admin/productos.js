import { Router } from "express"
import multer from "multer"
import { Productos } from "../../modelo/admin/producto.js"
import { insertar, editar, } from '../../validacion/admin/productos.js'

import fs from 'fs'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const rutas = Router()
const producto_ = new Productos()

rutas.post("/listar", async (req, res) => {
    // console.log(req)
    try {
        const resultado = await producto_.listar(req.body.cantidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})


rutas.post("/listar-categorias", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await producto_.listarCategorias()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }

})



rutas.post("/insertar", insertar, async (req, res) => {
    try {
        const { producto, categoria, beneficios, fecha_, estado, usuario, cantidad } = req.body
        const datos = { producto, categoria, beneficios, estado, creating: fecha_, usuario }
        const resultado = await producto_.insertar(datos, cantidad)
        if (resultado.error === 1) {
            return res.json({ ok: false, msg: 'Registro fállido' })
        }
        return res.json({ ok: true, data: resultado, msg: 'Registro Guardado' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})

const __dirname = dirname(fileURLToPath(import.meta.url));
// console.log(__dirname, ' direname de la ')
const disktorage = multer.diskStorage({

    destination: path.join(__dirname, '../../../imagenes/productos'),



    filename: (req, file, cb) => {
        // console.log(req.query, 'nombre imagen, gurdar imagen')
        cb(null, req.query.nombre + '.png')
    }
})

const fileUpload = multer({
    storage: disktorage
}).single('resultado')



rutas.post("/guardarImagen", fileUpload, async (req, res) => {
    try {
        const resultado = await producto_.actualizarImagen(req.query.cantidad)
        return res.json({ data: resultado, ok: true, msg: 'Imagen guardada' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})

rutas.post("/actualizarImagen", fileUpload, async (req, res) => {
    setTimeout(() => {
        return res.json({ msg: 'Imagen Actualizado' })
    }
        , 1000)
})

rutas.post("/actualizar", editar, async (req, res) => {
    try {
        const { id, producto, categoria, beneficios, fecha_, estado, usuario, } = req.body
        const datos = { id, producto, categoria, beneficios, estado, fecha_, usuario }

        const resultado = await producto_.actualizar(datos)
        if (resultado) return res.json({ data: resultado, msg: 'Registro actualizado' })
        else res.json({ data: resultado, msg: 'Registro no actualizado!' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})




rutas.post("/eliminar", fileUpload, async (req, res) => {

    try {

        const { id, cantidad, usuario, fecha_ } = req.body
        const datos = { id, cantidad, usuario, fecha_ }
        const resultado = await producto_.eliminarImagen(datos)

        if (resultado[1] > 0) {
            fs.unlinkSync(path.join(__dirname, '../../../imagenes/productos/' + id + '.png'))
            console.log(resultado[0])
            return res.json({ data: resultado[0], ok: true, msg: 'Imagen eliminado...' })
        }
        return res.json({ ok: false, msg: 'Eliminación fallida...!' })
    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})


rutas.post("/buscar",  async (req, res) => {
    const dato = req.body.dato;
    try {
        const resultado = await producto_.buscar(dato);
        return res.send({ data: resultado, ok: true });
    } catch (error) {
        console.log(error);
        return res.json({ error: 500, msg: error.sqlMessage });
    }
});


rutas.post("/siguiente", async (req, res) => {
    let id = req.body.id;
    try {
        const resultado = await producto_.listarSiguiente( id, req.body.cantidad);
        if (resultado.length > 0) return res.json({ ok: true, data: resultado });
        else return res.json({ ok: false, msg: "Ya no hay mas registros!" });
    } catch (error) {
        console.log(error);
        return res.json({ error: 500, msg: error.sqlMessage });
    }
});

rutas.post("/anterior", async (req, res) => {
    let id = req.body.id;
    try {
        const resultado = await producto_.listarAnterior( id,req.body.cantidad);
        if (resultado.length > 0) return res.json({ ok: true, data: resultado });
        else return res.json({ ok: false, msg: "Ya no hay mas registros!" });
    } catch (error) {
        console.log(error);
        return res.json({ error: 500, msg: error.sqlMessage });
    }
});



export default rutas;