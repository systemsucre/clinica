import { Router } from "express";
import { Evolucion } from "../modelo/evolucion.js";
import { editarEvolucion_, eliminarEvolucion_, insertarEvolucion_, } from "../validacion/evolucion.js";
import { insertar } from "../validacion/registro.js";


const rutas = Router();
const evolucion_ = new Evolucion();

rutas.post("/listar", async (req, res) => {
  // console.log(req.body, ' llamando fun ')
  try {
    const { consulta, usuario } = req.body

    const resultado = await evolucion_.listar(consulta, usuario);

    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error en el servidor" });
  }
});




rutas.post("/registrar", insertarEvolucion_, async (req, res) => {
  // console.log("datos: ", req.body);
  const {
    consulta, evolucion, conducta, fecha_, usuario, diagnostico
  } = req.body;
  const datos = {
    consulta, evolucion, indicaciones: conducta, fecha: fecha_, usuario, diagnostico
  };
  try {
    if (consulta) {
      const resultado = await evolucion_.insertarEvolucion(datos);

      if (!resultado[0])
        return res.json({
          ok: false,
          msg: "Fallo al registrar",
        });

      else
        return res.json({
          data: resultado[1],
          ok: true,
          msg: " registrado correctamente",
        });
    }
    else return res.json({ ok: false, msg: " Paciente no encontrado" });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});

rutas.post("/editar", editarEvolucion_, async (req, res) => {
  // console.log("datos: ", req.body);
  const {
    id, consulta, evolucion, conducta, fecha_, usuario, diagnostico
  } = req.body;
  const datos = {
    id, consulta, evolucion, indicaciones: conducta, fecha: fecha_, usuario, diagnostico
  };
  try {
    const resultado = await evolucion_.actualizar(datos);
    if (!resultado[0])
      return res.json({
        ok: false,
        msg: "Fallo al modificar",
      });

    else
      return res.json({
        data: resultado[1],
        ok: true,
        msg: " modificado correctamente",
      });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});

rutas.post("/eliminar", eliminarEvolucion_, async (req, res) => {
  // console.log("datos: ", req.body);
  const {
    id, fecha_, usuario, consulta
  } = req.body;
  const datos = {
    id, fecha: fecha_, usuario, consulta
  };
  try {
    const resultado = await evolucion_.eliminar(datos);
    if (!resultado[0])
      return res.json({
        ok: false,
        msg: "Fallo al eliminar",
      });

    else
      return res.json({
        data: resultado[1],
        ok: true,
        msg: " Eliminado correctamente",
      });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});




export default rutas;
