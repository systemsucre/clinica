import { Router } from "express";
import { Usuario } from "../../modelo/admin/usuario.js";
import {
  buscar,
  siguiente,
  insertar,
  actualizar,
  recet,
} from "../../validacion/admin/usuario.js";
import { CLAVEGMAIL } from "../../config.js";
import nodemailer from "nodemailer";

const rutas = Router();
const usuarios = new Usuario();

rutas.post("/listar", async (req, res) => {
  try {
    const resultado = await usuarios.listar(req.body.usuario, req.body.cantidad);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

rutas.post("/listar-excel", async (req, res) => {
  try {
    const resultado = await usuarios.listarExcel();
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});



rutas.post("/listar-entidad-rol", async (req, res) => {
  try {
    const resultado = await usuarios.listarEntidad();
    return res.json(resultado);
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});

rutas.post("/buscar", buscar, async (req, res) => {
  // console.log(req.body)
  const dato = req.body.dato;
  const user = req.body.usuario;
  try {
    const resultado = await usuarios.buscar(dato, user);
    return res.send({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});

rutas.post("/siguiente", siguiente, async (req, res) => {
  let id = req.body.id;
  try {
    const resultado = await usuarios.listarSiguiente(
      id,
      req.body.usuario,
      req.body.cantidad
    );
    if (resultado.length > 0) return res.json({ ok: true, data: resultado });
    else return res.json({ ok: false, msg: "Ya no hay mas registros!" });
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});

rutas.post("/anterior", siguiente, async (req, res) => {
  let id = req.body.id;
  try {
    const resultado = await usuarios.listarAnterior(
      id,
      req.body.usuario,
      req.body.cantidad
    );
    if (resultado.length > 0) return res.json({ ok: true, data: resultado });
    else return res.json({ ok: false, msg: "Ya no hay mas registros!" });
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});

rutas.post("/registrar", insertar, async (req, res) => {

  try {
    const {
      cantidad, ci, nombre, celular, correo, especialidad, rol_, contraseña, fecha_, usuario, entidad
    } = req.body;
    const datos = {
      ci, medico: nombre, celular, correo, especialidad, rol: rol_, contraseña, creating: fecha_, usuario, entidad
    };

    const resultado = await usuarios.insertar(datos, cantidad);


    if (resultado.error === 2)
      return res.json({ ok: false, msg: "Este Correo ya esta registrado" });
    if (resultado.error === 3)
      return res.json({ ok: false, msg: "Este C.I. ya esta registrado" });
    else
      return res.json({
        data: resultado,
        ok: true,
        msg: "El Usuario se ha registrado correctamente",
      });
  } catch (error) {
    console.log(error);
    // return res.json({ msg: "Error en el Servidor", ok: false });
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});

rutas.post("/actualizar", actualizar, async (req, res) => {
  //   console.log("datos: ", req.body);

  try {
    const {
      id, cantidad, ci, nombre, celular, correo, especialidad, rol_, estado, fecha_, usuario, entidad
    } = req.body;
    const datos = {
      id, ci, medico: nombre, celular, correo, especialidad, rol: rol_, estado, fecha_, usuario, entidad, cantidad
    };
    const resultado = await usuarios.actualizar(datos);
    if (resultado.existe === 2)
      return res.json({ ok: false, msg: "Falló al modificar el registro!" });
    if (resultado.existe === 2)
      return res.json({ ok: false, msg: "Correo ya esta registrado" });
    if (resultado.existe === 3)
      return res.json({ ok: false, msg: "Numero de identificación ya esta registrado" });
    else
      return res.json({
        data: resultado,
        ok: true,
        msg: "Registro actualizado correctamente",
      });

  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});

rutas.post("/recet", recet, async (req, res) => {
  console.log(req.body)
  try {
    const { id, otros, fecha_, usuario } = req.body;
    const datos = {
      id,
      otros,
      fecha_,
      usuario,
    };
    const resultado = await usuarios.recet(datos);
    if (resultado)
      return res.json({
        ok: true,
        msg: "Contraseña se ha reiciado correctamete",
      });
    else
      return res.json({ ok: false, msg: "Contraseña no se ha actualizado!" });
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});

export default rutas;
