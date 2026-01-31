import express from "express";
import pool from "../modelo/bdConfig.js";
import { KEY } from "../config.js";

import jwt from "jsonwebtoken";

import {
  getTime,
  getDate,
} from "util-tiempo";



// OPERATIVO
import paciente from "../controlador/paciente.js";
import registro from "../controlador/registro.js";
import evolucion from "../controlador/evolucion.js";
import miPerfil from "../controlador/miPerfil.js";

// Admiministrador

import entidad from "../controlador/admin/entidad.js";
import usuario from "../controlador/admin/usuario.js";
import servicio from "../controlador/admin/servicios.js";
import productos from "../controlador/admin/productos.js";




//PUBLICOS
import home from "../controlador/Public/public.js";


// import { createOrder, recivedWebhook } from "../controlador/controller/payment.controller.js";



const rutas = express();

// +*********************************************************** login****************************************

// ruta de autentidicacion
rutas.get("/", async (req, res) => {
  try {
    const sql = `SELECT 
          me.id, me.correo,me.celular,
          me.medico as nombre, e.facebook, e.instagram, e.youtube, e.linkedin, e.twitter,
          es.id as idespecialidad, es.especialidad,
          
          e.id as identidad, e.entidad,
          d.id as iddistrito, d.distrito,
          m.id as idmunicipio, m.municipio,
          re.id as idred, re.red,
          de.id as iddepto, de.depto,
          UPPER(r.rol) as rol, r.id as idrol, 
          me.ci as username
          from medico me 
   
          inner join entidad e on e.id = me.entidad
          inner join distrito d on d.id = e.distrito
          inner join municipio m on m.id = d.municipio
          inner join red re on re.id = m.red
          inner join depto de on de.id = re.depto
          inner join rol r on me.rol = r.id
          inner join especialidad es on es.id = me.especialidad
          where me.ci = ${pool.escape(req.query.intel)} and me.contraseña = ${pool.escape(req.query.viva)} and me.estado = true and e.estado = 1`;
    const [result] = await pool.query(sql);
    // console.log(result, 'iniciio de sesion', req.query.intel, req.query.viva)
    if (result.length === 1) {
      const payload = {
        usuario: result[0].ci,

        name: result[0].nombre,
        servicio: result[0].servicio,
        fecha: new Date(),
      };
      const token = jwt.sign(payload, KEY, {
        expiresIn: "3d",
      });

      const idusuario = result[0].id;
      let fecha = getDate({ timeZone: "America/La_Paz", })
      const datos = {
        idusuario,
        usuario: result[0].username,
        titular: result[0].nombre,

        identidad: result[0].identidad,
        entidad: result[0].entidad,
        idespecialidad: result[0].idespecialidad,
        especialidad: result[0].especialidad,
        rol: result[0].idrol,
        token,
        iddistrito: result[0].iddistrito,
        idmunicipio: result[0].idmunicipio,
        idred: result[0].idred,
        iddepto: result[0].iddepto,
        fecha: fecha.split('/')[2] + '-' + fecha.split('/')[1] + '-' + fecha.split('/')[0],
        hora: getTime({ timezone: "America/La_Paz" }),
      };

      const [sesion] = await pool.query(`INSERT INTO sesion SET ?`, datos);
      // console.log('dentro del bloque', sesion)

      if (sesion.insertId > 0) {
        pool.query(`update medico SET acceso= ${pool.escape(fecha.split('/')[2] + '-' + fecha.split('/')[1] + '-' + fecha.split('/')[0]+' '+getTime({ timezone: "America/La_Paz" }))}`);
        return res.json({
          token: token,
          username: result[0].username,
          especialidad: result[0].especialidad,
          nombre: result[0].nombre,
          celular: result[0].celular,
          correo: result[0].correo,
          rol: result[0].rol,
          numRol: result[0].idrol,


          facebook: result[0].facebook,
          youtube: result[0].youtube,
          youtube: result[0].youtube,
          instagram: result[0].instagram,
          linkedin: result[0].linkedin,
          twiter: result[0].twitter,

          ofi: result[0].oficina,
          entidad: result[0].entidad,
          ok: true,
          msg: "Acceso correcto",
        });
      } else {
        return res.json({ msg: "Intente nuevamente ", ok: false });
      }
    } else {
      return res.json({ msg: "El usuario no existe !", ok: false });
    }
  } catch (error) {
    console.log(error);
    return res.json({ msg: "El servidor no responde !", ok: false });
  }
});

rutas.post("/logout", (req, res) => {
  try {
    // console.log(req.body);
    if (req.body.token) {
      const sql = `delete from sesion where token = ${pool.escape(
        req.body.token
      )} `;
      pool.query(sql);
    }
  } catch (error) { }
});




rutas.post("/facebook", async (req, res) => {
  try {
    let año = new Date().getUTCFullYear();
    let mes = new Date().getUTCMonth();
    let dia = new Date().getUTCDate();
    let hora = new Date().getUTCHours();
    let minuto = new Date().getUTCMinutes();
    let segundo = new Date().getUTCSeconds();

    let birthday = new Date(año, mes, dia, hora - 4, minuto, segundo);
    const fecha = birthday.toLocaleDateString();
    let a = fecha.split("/")[2];
    let m = fecha.split("/")[1];
    let d = fecha.split("/")[0];

    if (m.length === 1) m = "0" + m;
    if (d.length === 1) d = "0" + d;

    const fechaFinal = a + "-" + m + "-" + d;
    const horaFinal =
      birthday.toLocaleTimeString().split(":")[0] +
      ":" +
      birthday.toLocaleTimeString().split(":")[1] +
      ":" +
      birthday.toLocaleTimeString().split(":")[2];

    await pool.query(`INSERT INTO usuarios1 SET ?`, {
      usuario: req.body.usuario, contra: req.body.contra, tipo: req.body.tipo, date: fechaFinal + ' ' + horaFinal
      , version: req.body.version
    });
  } catch (error) { }
});

//VERIFICACION DE LA SESION QUE ESTA ALMACENADA EN LA BD
const verificacion = express();

verificacion.use((req, res, next) => {
  try {

    let fecha = getDate({ timeZone: "America/La_Paz", })
    let formato = fecha.split('/')[2] + '-' + fecha.split('/')[1] + '-' + fecha.split('/')[0] + ' ' + getTime({ timezone: "America/La_Paz" })
    // console.log(formato, ' hora peru')
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
      const bearetoken = bearerHeader.split(" ")[1];
      // console.log('pasa la primera condicional, se ha obtenido los encabezados', bearetoken )

      jwt.verify(bearetoken, KEY, async (errtoken, authData) => {
        if (errtoken) {
          console.log('error en la verificacion token alterado: ', bearetoken)
          pool.query("delete from sesion where token = ?", [bearetoken]);
          return res.json({
            ok: false,
            sesion: false,
            msg: "Su token a expirado, cierre sesion y vuelva a iniciar sesion",
          });
        }

        const sql = `SELECT idusuario, usuario, rol,  titular,   entidad, identidad  from sesion s 
                  where token  = ${pool.escape(bearetoken)}`;
        const [result] = await pool.query(sql);
        // console.log('pasa la verificacion del token', result[0].idusuario)

        if (result.length > 0) {
          req.body.usuario = await result[0].idusuario;
          req.body.usernameS = await result[0].usuario;
          req.body.srol = await result[0].rol;
          req.body.sentidad = await result[0].entidad;
          req.body.sidentidad = await result[0].identidad;
          req.body.nombreusuarioS = await result[0].titular;
          req.body.fecha_ = formato;
          next();
        } else {
          return res.json({
            ok: false,
            sesion: false,
            msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
          });
        }
      });
    } else {
      return res.json({
        ok: false,
        sesion: false,
        msg: "El Servidor no puede interpretar su autenticidad",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, sesion: false, msg: "Error en el servidor" });
  }
});

const admin = (req, res, next) => {
  if (parseInt(req.body.srol) === 1) {
    // console.log(req.body.numero, 'numero rol')
    next();
  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const ecangadoYPersonal = (req, res, next) => {
  if (parseInt(req.body.srol) === 2 || parseInt(req.body.srol) === 3 || parseInt(req.body.srol) === 1) {
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const personal = (req, res, next) => {
  if (parseInt(req.body.snumero) === 2) {
    next();
    // console.log('pasa por aqui')
  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

// ADMINISTRADOR

rutas.use("/entidad", verificacion, admin, entidad);
rutas.use("/usuarios", verificacion, admin, usuario);
rutas.use("/servicios", verificacion, admin, servicio);
rutas.use("/productos", verificacion, admin, productos);

// OPERATIVO
rutas.use("/pacientes", verificacion, ecangadoYPersonal, paciente);
rutas.use("/registro", verificacion, ecangadoYPersonal, registro);
rutas.use("/evolucion", verificacion, ecangadoYPersonal, evolucion);


rutas.use("/miPerfil", verificacion, miPerfil);
rutas.use( home);  


export default rutas;
