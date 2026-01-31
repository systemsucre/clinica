import pool from "./bdConfig.js";

export class Evolucion {


  listar = async (consulta, usuario) => {


    const sql = `SELECT e.id, e.evolucion, e.indicaciones, e.diagnostico, DATE_FORMAT(e.fecha, "%Y/%m/%d") as fecha, if(c.usuario = ${pool.escape(usuario)}, true, false) as edicion
                  from evolucion e
                  inner join consulta c on c.id = e.consulta
                  where c.id = ${pool.escape(consulta)} and c.delet = false and e.delet = false order by id DESC`;
    const [rows] = await pool.query(sql);

    const sqlEdicion = `SELECT if(usuario = ${pool.escape(usuario)}, true, false) as edicion
    from consulta 
    where id = ${pool.escape(consulta)}`;
    const [edicion] = await pool.query(sqlEdicion);

    return [rows, edicion[0].edicion];
  };

  insertar = async (datos) => {
    const [result] = await pool.query("INSERT INTO consulta SET  ?", datos);
    if (result.insertId > 0) {
      const lis = await this.listar(datos.consulta, datos.usuario)
      return [true, lis];

    }
    else return [false, []]
  };

  insertarEvolucion = async (datos) => {
    const [result] = await pool.query("INSERT INTO evolucion SET  ?", datos);
    if (result.insertId > 0) {
      const lis = await this.listar(datos.consulta, datos.usuario)
      return [true, lis];
    }
    else return [false, []]
  };


  actualizar = async (datos) => {

    const sql = `UPDATE evolucion SET
                
                evolucion = ${pool.escape(datos.evolucion)},
                indicaciones = ${pool.escape(datos.indicaciones)},
                diagnostico = ${pool.escape(datos.diagnostico)},
                editing = ${pool.escape(datos.fecha)}
                WHERE id = ${pool.escape(datos.id)} and usuario = ${pool.escape(datos.usuario)}`;

    const [rows] = await pool.query(sql);
    // console.log(rows)
    if (rows.affectedRows > 0) {
      const data = await this.listar(datos.consulta, datos.usuario)
      return [true, data]
    } else {
      return [false, []]
    }
  };


  eliminar = async (datos) => {
    const sql = `UPDATE evolucion SET
                delet = true,
                editing = ${pool.escape(datos.fecha)}
                WHERE id = ${pool.escape(datos.id)} and usuario = ${pool.escape(datos.usuario)}`;
    const [rows] = await pool.query(sql);
    // console.log(rows)
    if (rows.affectedRows > 0) {
      const data = await this.listar(datos.consulta, datos.usuario)
      return [true, data]
    } else {
      return [false, []]
    }
  };

}
