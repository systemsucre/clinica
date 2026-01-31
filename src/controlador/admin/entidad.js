import { Router } from "express"
import { Entidad } from "../../modelo/admin/entidad.js"
import { insertar, editar, eliminar,  } from '../../validacion/admin/entidad.js'

//const modelo = require("../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos

const rutas = Router()
const entidad_ = new Entidad()

rutas.post("/listar", async (req, res) => {
    // console.log(req)
    try {
        const resultado = await entidad_.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})


rutas.post("/listar-distrito", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await entidad_.listarDistrito()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }

})



rutas.post("/insertar", insertar, async (req, res) => {


    try {
        const { entidad, direccion, celular, distrito, usuario, fecha_, facebook, instagram, youtube, linkedin, twitter, } = req.body
        const datos = { entidad, direccion, celular, distrito, usuario, editing: fecha_,facebook, instagram, youtube, linkedin, twitter }
        const resultado = await entidad_.insertar(datos)
        if (resultado.error === 1) {
            return res.json({ ok: false, msg: 'ya existe el registro' })
        }
        return res.json({ ok: true, data: resultado, msg: 'Registro Guardado' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})



rutas.post("/actualizar", editar, async (req, res) => {
    try {
        const {id, entidad, direccion, celular, distrito, usuario, fecha_, facebook, instagram, youtube, linkedin, twitter,estado } = req.body
        const datos = { id,entidad, direccion, celular, distrito, usuario, editing: fecha_,facebook, instagram, youtube, linkedin, twitter, estado }

        const resultado = await entidad_.actualizar(datos)
        if (resultado.error === 1) {
            return res.json({ msg: 'ya existe el registro', ok: false })
        }
        if (resultado.error === 2) {
            return res.json({ msg: 'Actualizacion Fállida', ok: false })
        }
        return res.json({ ok: true, data: resultado, msg: 'Registro actualizado' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        let cantidad = req.body.cantidad
        const id = req.body.id;
        const resultado = await entidad_.eliminar(id, cantidad, req.body.fecha_)
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha eliminado' })
    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})



export default rutas;