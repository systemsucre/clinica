import { Router } from "express"
import multer from "multer"
import { Servicios } from "../../modelo/admin/servicios.js"
import { insertar, editar, } from '../../validacion/admin/servicios.js'

import fs from 'fs'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const rutas = Router()
const servicio_ = new Servicios()

rutas.post("/listar", async (req, res) => {
    // console.log(req)
    try {
        const resultado = await servicio_.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})


rutas.post("/listar-entidad", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await servicio_.listarEntidad()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }

})



rutas.post("/insertar", insertar, async (req, res) => {


    try {
        const { entidad, servicio, procedimiento, fecha_, usuario } = req.body
        const datos = { entidad, servicio, proce: procedimiento, creating: fecha_, usuario }
        const resultado = await servicio_.insertar(datos)
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

    destination: path.join(__dirname, '../../../imagenes/servicios'),



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
        const resultado = await servicio_.actualizarImagen()
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
        const { id, entidad, servicio, procedimiento, fecha_, usuario } = req.body
        const datos = { id, entidad, servicio, proce: procedimiento, editing: fecha_, usuario }

        const resultado = await servicio_.actualizar(datos)

        return res.json({ ok: true, data: resultado, msg: 'Registro actualizado' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})



rutas.post("/eliminar", fileUpload, async (req, res) => {

    try {
        const resultado = await servicio_.eliminarImagen(req.body.id)
        console.log('eliminar imagen en e. controlador', resultado)

        if (resultado[1] > 0) {
            fs.unlinkSync(path.join(__dirname, '../../../imagenes/servicios/' + req.body.id + '.png'))
            return res.json({ data: resultado[0], ok: true, msg: 'Imagen eliminado...' })
        }
        return res.json({ ok: false, msg: 'Eliminación fallida...!' })
    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})



export default rutas;