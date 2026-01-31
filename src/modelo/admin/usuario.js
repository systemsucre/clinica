import pool from "../bdConfig.js";

export class Usuario {
  // METODOS



  // metodos publicos

  listarMedicos = async () => {

    const sql1 = `SELECT e.entidad, e.direccion, e.celular,  m.img as img, m.medico , m.rol
            from medico m
            inner join rol r on r.id = m.rol
            inner join entidad e on e.id = m.entidad
            where r.id > 2`;
    const [rows1] = await pool.query(sql1);

    const sql2 = `SELECT *
    from compañia`;
    const [rows2] = await pool.query(sql2);

    const sql4 = `SELECT p.id, p.categoria as idcategoria, p.producto, p.id as img, p.beneficios, p.estado, c.id as categoria, c.categoria as nombrecategoria,  c.color2,c.color3
    from productos p
    inner join categorias c on p.categoria = c.id
    where p.estado!=0 order by p.producto DESC limit 8`;
    const [rows4] = await pool.query(sql4);

    const sql5 = `SELECT *
    from categorias`;
    const [rows5] = await pool.query(sql5);

    return [rows1, rows2, rows4, rows5];
  };


  // metodos admin
  listar = async (id, cantidad) => {
    const sql = `SELECT 
    m.id, m.ci, r.id as idrol, r.rol, m.medico, es.id as  idespecialidad, es.especialidad,e.id as identidad,
            e.entidad, m.celular, m.correo, m.estado
            from medico m 
            left join rol r on r.id = m.rol
            left join entidad e on e.id = m.entidad
            left join especialidad es on es.id = m.especialidad
            where m.id != ${pool.escape(id)}
            ORDER by m.id desc limit ${pool.escape(cantidad)}`;

    const [rows] = await pool.query(sql);
    const cant = `SELECT count(id) as cantidad from medico
            where id != ${pool.escape(id)}
            `;
    const [cat1] = await pool.query(cant);
    return [rows, cat1[0].cantidad];
  };
  listarExcel = async () => {
    const sql = `SELECT 
            m.id, m.ci, r.id as idrol, r.rol, m.medico, es.id as  idespecialidad, es.especialidad,e.id as identidad,m.creating, m.editing,m.acceso, me.medico as autor,
            e.entidad, m.celular, m.correo, m.estado
            from medico m 
            left join rol r on r.id = m.rol
            left join entidad e on e.id = m.entidad
            left join especialidad es on es.id = m.especialidad
            inner join medico me on me.id =  m.usuario
            `;

    const [rows] = await pool.query(sql);

    return rows
  };

  listarEntidad = async () => {
    const sql = `SELECT id, entidad as label from entidad  where estado = 1 order by entidad asc`;
    const [rows] = await pool.query(sql);
    const sql1 = `SELECT id, rol as label from rol `;
    const [rows1] = await pool.query(sql1);

    const sql2 = `SELECT id, especialidad as label from especialidad `;
    const [rows2] = await pool.query(sql2);
    // console.log(rows, "oficinaaa ");
    return [rows, rows1, rows2];
  };

  buscar = async (dato, user) => {
    // console.log('los datos han llegado', dato)
    const sql = `SELECT 
            m.id, m.ci, r.id as idrol, r.rol, m.medico, es.id as  idespecialidad, es.especialidad,e.id as identidad,
            e.entidad, m.celular, m.correo, m.estado
            from medico m 
            left join rol r on r.id = m.rol
            left join entidad e on e.id = m.entidad
            left join especialidad es on es.id = m.especialidad
            where (m.medico like '${dato}%' or
            m.ci like '${dato}%') and m.id != ${pool.escape(user)}
            ORDER by m.id asc`;
    const [rows] = await pool.query(sql);
    return rows;
  };

  listarSiguiente = async (id, user, cantidad) => {
    const sql = `SELECT 
            m.id, m.ci, r.id as idrol, r.rol, m.medico, es.id as  idespecialidad, es.especialidad,e.id as identidad,
            e.entidad, m.celular, m.correo, m.estado
            from medico m 
            left join rol r on r.id = m.rol
            left join entidad e on e.id = m.entidad
            left join especialidad es on es.id = m.especialidad
            where m.id != ${pool.escape(user)}
            and m.id < ${pool.escape(id)} ORDER by m.id DESC  limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    // console.log("los datos han llegado", sql);
    return rows;
  };
  listarAnterior = async (id, user, cantidad) => {
    const sql = `SELECT 
            m.id, m.ci, r.id as idrol, r.rol, m.medico, es.id as  idespecialidad, es.especialidad,e.id as identidad,
            e.entidad, m.celular, m.correo, m.estado
            from medico m 
            left join rol r on r.id = m.rol
            left join entidad e on e.id = m.entidad
            left join especialidad es on es.id = m.especialidad
            WHERE m.id > ${pool.escape(id)} and m.id != ${pool.escape(user)} 
            limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    rows.reverse();
    return rows;
  };

  insertar = async (datos, cantidad) => {

    const sqlexisteC = `SELECT correo from medico where
                correo = ${pool.escape(
      datos.correo
    )} and correo != 'example@systemsucre.info'`;
    const [rowsCorreo] = await pool.query(sqlexisteC);

    if (rowsCorreo.length === 0) {
      const sqlci = `SELECT ci from medico where
                    ci = ${pool.escape(datos.ci)}`;
      const [rows] = await pool.query(sqlci);

      if (rows.length === 0) {

        await pool.query("INSERT INTO medico SET  ?", datos);
        return await this.listar(datos.usuario, cantidad);
      } else return { error: 3 };
    } else return { error: 2 };
  };

  actualizar = async (datos) => {
    // console.log(datos, "datos desde el modelo");
    const sqlcorreo = `SELECT correo from medico where
                correo = ${pool.escape(datos.correo)} and id != ${pool.escape(datos.id)} and correo != 'example@systemsucre.info'`;
    const [rowsCorreo] = await pool.query(sqlcorreo);

    if (rowsCorreo.length === 0) {
      const sqlci = `SELECT ci from medico where
        ci = ${pool.escape(datos.ci)} and id != ${pool.escape(datos.id)}`;
      const [rows] = await pool.query(sqlci);

      if (rows.length === 0) {
        const sql = `UPDATE medico SET
                rol = ${pool.escape(datos.rol)},
                
                ci = ${pool.escape(datos.ci)},
                medico = ${pool.escape(datos.medico)},
               
                celular = ${pool.escape(datos.celular)},
                correo = ${pool.escape(datos.correo)},

                entidad = ${pool.escape(datos.entidad)},
                especialidad = ${pool.escape(datos.especialidad)},

                estado=${pool.escape(datos.estado)},
                editing = ${pool.escape(datos.fecha_)},
                usuario = ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)}`;

        const [res] = await pool.query(sql);

        if (res.affectedRows > 0) {
          const sesion = `delete from sesion where
          usuario = ${pool.escape(datos.id)}`;
          await pool.query(sesion);
          return await this.listar(datos.usuario, datos.cantidad)
        }
        else return { error: 1 }

      } else return { existe: 3 };
    } else return { existe: 2 };
  };


  recet = async (datos) => {
    const sql = `UPDATE medico SET
                contraseña = ${pool.escape(datos.otros)},
                usuario = ${pool.escape(datos.usuario)},
                editing = ${pool.escape(datos.fecha_)}
                WHERE id = ${pool.escape(datos.id)}`;
    const [res] = await pool.query(sql);
    if (res.affectedRows > 0) {
      const sesion = `delete from sesion where
                    usuario = ${pool.escape(datos.id)}`;
      await pool.query(sesion);
      return true;
    }
  };


  // metodos, gestionar mi perfil
  cambiarMiContraseña = async (datos) => {
    const sqlExists = `SELECT * FROM medico WHERE 
            contraseña = ${pool.escape(datos.pass1)} 
            and id = ${pool.escape(datos.usuario)}`;
    const [result] = await pool.query(sqlExists);

    if (result.length > 0) {
      const sql = `UPDATE medico SET
                contraseña = ${pool.escape(datos.pass2)}, editing = ${pool.escape(datos.fecha)}, usuario = ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.usuario)}`;

      await pool.query(sql);
      return true;
    } else return false;
  };

  actualizarMiPerfil = async (datos) => {
    const sqlexisteCorreo = `SELECT correo from medico where correo = ${pool.escape(datos.correo)} and id != ${pool.escape(datos.usuario)} and correo != 'example@systemsucre.info'`;
    const [result] = await pool.query(sqlexisteCorreo);
    if (result.length === 0) {
      const sql = `UPDATE medico SET
            medico = ${pool.escape(datos.nombre)},
            celular = ${pool.escape(datos.celular)},
            correo = ${pool.escape(datos.correo)},
            editing = ${pool.escape(datos.fecha_)},
            usuario = ${pool.escape(datos.usuario)}
            WHERE id = ${pool.escape(datos.usuario)}`;
      await pool.query(sql);
      return await this.miPerfil(datos.usuario);
    } else return { existe: 1 };
  };

  miPerfil = async (id) => {
    let sqlUser = `select m.id, m.ci, m.medico , m.ci as username,  m.correo, 
                            m.celular, 
                            r.rol as rol, 
                            e.entidad as entidad
                            from medico m
                            left join rol r on r.id = m.rol
                            left join entidad e  on e.id = m.entidad
                            where m.id  = ${pool.escape(id)}`;

    const [result] = await pool.query(sqlUser);
    // console.log(result)

    return result;
  };
}
