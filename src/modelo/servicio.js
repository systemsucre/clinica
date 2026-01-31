import pool from "./bdConfig.js";

export class Servicio {


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
