import pool from "./bdConfig.js";

export class Paciente {
  // METODOS

  listar = async (cantidad) => {
    const sql = `SELECT id, nhc, ap1, ap2 , nombre, DATE_FORMAT(fechanac, '%Y-%m-%d') as fecha,celular,  DATE_FORMAT(creating, '%Y-%m-%d') as fechacreacion, direccion, nacademico, sexo,gsangre,creating,
                antecper, fototipo,ocupacion,
                estadocivil, otros, municipio, antec from paciente where delet = false  ORDER by id DESC  limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    const cant = `SELECT count(id) as cantidad from paciente where delet = false  `;
    const [cat1] = await pool.query(cant);

    const sqlMunicipio = `SELECT id, municipio as label from municipio where estado = true`;
    const [municipio] = await pool.query(sqlMunicipio);

    // console.log(cat1)
    return [rows, cat1[0].cantidad, municipio];
  };





  buscar = async (dato, ) => {
    // console.log('los datos han llegado', dato)
    const sql = `SELECT id, nhc, ap1, ap2 , nombre, DATE_FORMAT(fechanac, '%Y-%m-%d') as fecha,celular,  DATE_FORMAT(creating, '%Y-%m-%d') as fechacreacion, direccion, nacademico, sexo,gsangre,creating,
    antecper, fototipo,ocupacion,
    estadocivil, otros, municipio, antec from paciente
            where (
            nombre like '${dato}%' or
            nhc like '${dato}%' or
            ap1  like '${dato}%' or
            ap2  like '${dato}%'
          )
            ORDER by id asc`;
    const [rows] = await pool.query(sql);
    return rows;
  };

  listarSiguiente = async (id, cantidad) => {
    const sql = `SELECT id, nhc, ap1, ap2 , nombre, DATE_FORMAT(fechanac, '%Y-%m-%d') as fecha,celular,  DATE_FORMAT(creating, '%Y-%m-%d') as fechacreacion, direccion, nacademico, sexo,gsangre,creating,
    antecper, fototipo,ocupacion,
    estadocivil, otros, municipio, antec from paciente where id < ${pool.escape(id)}  and delet = false 
    ORDER by id DESC  limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    // console.log("los datos han llegado", sql);
    return rows;
  };
  listarAnterior = async (id, cantidad) => {
    const sql = `SELECT id, nhc, ap1, ap2 , nombre, DATE_FORMAT(fechanac, '%Y-%m-%d') as fecha,celular,  DATE_FORMAT(creating, '%Y-%m-%d') as fechacreacion, direccion, nacademico, sexo,gsangre,creating,
    antecper, fototipo,ocupacion,
    estadocivil, otros, municipio, antec from paciente where id > ${pool.escape(id)}  and delet = false 
            limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    rows.reverse();
    return rows;
  };

  insertar = async (datos, cantidad) => {
    const sqlexisteusername = `SELECT nhc from paciente where
                nhc = ${pool.escape(datos.nhc)} and delet = 0`;
    const [rows] = await pool.query(sqlexisteusername);

    if (rows.length === 0) {
      await pool.query("INSERT INTO paciente SET  ?", datos);
      return await this.listar(cantidad);

    } else return { existe: 1 };
  };

  actualizar = async (datos) => {
    const sqlexisteusername = `SELECT nhc from paciente where
                nhc = ${pool.escape(datos.nhc)} and id != ${pool.escape(datos.id)} and delet = 0 `;
    const [rows] = await pool.query(sqlexisteusername);

    // console.log(datos)
    if (rows.length === 0) {
      const sql = `UPDATE paciente SET
                nhc = ${pool.escape(datos.nhc)},
                ap1 = ${pool.escape(datos.ap1)},
                ap2 = ${pool.escape(datos.ap2)},
                nombre = ${pool.escape(datos.nombre)},
                fechanac= ${pool.escape(datos.fechanac)},
                estadocivil = ${pool.escape(datos.estadocivil)},
                nacademico = ${pool.escape(datos.nacademico)},
                celular = ${pool.escape(datos.celular)},
                sexo = ${pool.escape(datos.sexo)},
                fototipo = ${pool.escape(datos.fototipo)},
                direccion = ${pool.escape(datos.direccion)},
                municipio = ${pool.escape(datos.municipio)},
                antec= ${pool.escape(datos.antec)},
                antecper= ${pool.escape(datos.antecper)},
               
                gsangre = ${pool.escape(datos.gsangre)},
                otros= ${pool.escape(datos.otros)},
                ocupacion= ${pool.escape(datos.ocupacion)},
                editing = ${pool.escape(datos.editing)},
                usuario= ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)}`;

      const [fila] = await pool.query(sql);
      // console.log(datos,fila, 'filakkkk')

      if (fila.affectedRows > 0) {
        const resultado = await this.listar(datos.cantidad);
        return [true, resultado]
      } else return [false, []]
    } else return { existe: 1 };
  }

  eliminar = async (datos) => {
    const sqlexisteusername = `SELECT * from  consulta where paciente = ${pool.escape(datos.id)} AND delet = 0`;
    const [rows] = await pool.query(sqlexisteusername);

    if (rows.length === 0) {
      const sql = `UPDATE paciente SET
                delet = true,
                editing = ${pool.escape(datos.editing)},
                usuario= ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)}`;

      const [fila] = await pool.query(sql);
      // console.log(datos,fila, 'filakkkk')

      if (fila.affectedRows > 0) {
        const resultado = await this.listar(datos.cantidad);
        return [true, resultado]
      } else return [false, []]
    } else return { existe: 1 }
  }
}
