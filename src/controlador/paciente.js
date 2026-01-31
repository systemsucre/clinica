import { Router } from "express";
import { Paciente } from "../modelo/paciente.js";
import {
  buscar,
  siguiente,
  insertar,

} from "../validacion/paciente.js";


const rutas = Router();
const usuarios = new Paciente();

rutas.post("/listar", async (req, res) => {

  try {
    const resultado = await usuarios.listar(req.body.cantidad, req.body.sidentidad);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error en el servidor" });
  }
});





rutas.post("/buscar", buscar, async (req, res) => {
  const dato = req.body.dato;
  try {
    const resultado = await usuarios.buscar(dato);
    return res.send({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error en el servidor" });
  }
});

rutas.post("/siguiente", siguiente, async (req, res) => {
  let id = req.body.id;
  try {
    const resultado = await usuarios.listarSiguiente(
      id,
      req.body.cantidad
    );
    if (resultado.length > 0) return res.json({ ok: true, data: resultado });
    else return res.json({ ok: false, msg: "Ya no hay mas registros!" });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error en el servidor" });
  }
});

rutas.post("/anterior", siguiente, async (req, res) => {
  let id = req.body.id;
  try {
    const resultado = await usuarios.listarAnterior(
      id,
      req.body.cantidad
    );
    if (resultado.length > 0) return res.json({ ok: true, data: resultado });
    else return res.json({ ok: false, msg: "Ya no hay mas registros!" });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error en el servidor" });
  }
});

rutas.post("/registrar", insertar, async (req, res) => {
  // console.log("datos: ", req.body);s
  const {
    nhc, cantidad,
    ap1,
    ap2, sexo,
    nombre, fechan, ec, na, celular, direccion, ft,municipio, ant, gsangre, otros, fecha_, usuario,  antecper, ocupacion,

  } = req.body;
  const datos = {
    nhc,
    ap1,
    ap2:ap2=='AA'?null:ap2, ocupacion,
    nombre, fechanac: fechan, estadocivil: ec, nacademico: na, sexo,antecper, fototipo:ft,
    celular, direccion,  municipio,
    antec: ant, gsangre, otros, creating: fecha_, usuario, autor: usuario
  };
  try {
    const resultado = await usuarios.insertar(datos, cantidad,);

    if (resultado.existe === 1)
      return res.json({
        ok: false,
        msg: "Numero de N.H.C ya esta registrado",
      });

    else return res.json({
      data: resultado,
      ok: true,
      msg: "Registro creado correctamente",
    });

  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});


rutas.post("/modificar", insertar, async (req, res) => {
  console.log("datos: ", req.body);
  const {
    id,
    nhc, cantidad,
    ap1, sexo, 
    ap2,
    nombre, fechan, ec, na, celular, direccion, municipio, ant,antecper, gsangre, otros, fecha_, usuario, ft, ocupacion,

  } = req.body;
  const datos = {
    id,
    nhc, cantidad, ocupacion,
    ap1,
    ap2:ap2=='AA'?null:ap2,
    nombre, fechanac: fechan, estadocivil: ec, nacademico: na, sexo,
    celular, direccion, municipio,fototipo:ft,
    antec: ant,antecper, gsangre, otros, editing: fecha_, usuario, autor: usuario
  };
  try {
    const resultado = await usuarios.actualizar(datos);

    if (resultado.existe === 1)
      return res.json({
        ok: false,
        msg: "Este C.I. ya esta registrado",
      });

    else {
      if (!resultado[0])
        return res.json({
          ok: false,
          msg: "Registro no actualizado",
        });
      else return res.json({
        data: resultado[1],
        ok: true,
        msg: "Registro actualizado correctamente",
      });
    }

  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});


rutas.post("/eliminar", async (req, res) => {
  // console.log("datos: ", req.body);
  const {
    id,
    fecha_, usuario, cantidad, 

  } = req.body;
  const datos = {
    id,
    editing: fecha_, usuario, cantidad
  };
  try {
    const resultado = await usuarios.eliminar(datos);

    if (resultado.existe === 1)
      return res.json({
        ok: false,
        msg: "Este paciente tiene consultas asociadas, primero quitelos y vuelva a intentar",
      });

    else {
      if (!resultado[0])
        return res.json({
          ok: false,
          msg: "Registro no eliminado",
        });
      else return res.json({
        data: resultado[1],
        ok: true,
        msg: "Registro eliminado correctamente",
      });
    }

  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});



export default rutas;
