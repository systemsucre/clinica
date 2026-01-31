import { Router } from "express"
import { Usuario } from '../../modelo/admin/usuario.js'
import{Servicio} from '../../modelo/admin/servicio.js'
import{Productos} from '../../modelo/admin/producto.js'
// import nodemailer from "nodemailer";
// import { CLAVEGMAIL } from '../../config.js'
// import pool from '../../modelo/bdConfig.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const usuario = new Usuario()
const servicio = new Servicio()
const producto = new Productos()


rutas.get("/get-service",  async (req, res) => {
    
    try {
        const resultado = await servicio.getService(req.query.id)
        return res.json({ data:resultado, ok: true, msg: "Espere que el administrador valide su nueva cuenta" });
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el Servidor', ok: false })
    }
})

rutas.get("/get-services",  async (req, res) => {
    try {
        const resultado = await servicio.getServices()
        return res.json({ data:resultado, ok: true, msg: "Datos obtenidos correctamente desde la API de SYSTEM SUCRE. SOA microservices" });
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el Servidor', ok: false })
    }
})



rutas.get("/buscar-producto",  async (req, res) => {
    try {
        // console.log(req.body)
        const resultado = await producto.buscarPorTexto(req.query.dato)
        return res.json({ data:resultado, ok: true, msg: "Datos obtenidos correctamente desde la API de SYSTEM SUCRE. SOA microservices" });
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el Servidor', ok: false })
    }
})

rutas.get("/buscar-producto-por-categoria",  async (req, res) => {
    try {
        // console.log(req.body)
        const resultado = await producto.buscarPorCategoria(req.query.id)
        return res.json({ data:resultado, ok: true, msg: "Datos obtenidos correctamente desde la API de SYSTEM SUCRE. SOA microservices" });
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el Servidor', ok: false })
    }
})



rutas.get("/listar",  async (req, res) => {

    try {
        const resultado = await usuario.listarMedicos()
    
        return res.json({ data:resultado, ok: true, msg: "Espere que el administrador valide su nueva cuenta" });


    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el Servidor', ok: false })
    }
})


















export default rutas;