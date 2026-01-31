import pool from "./bdConfig.js";
import pool1 from "./bdConfig1.js";

export class Ofi {
  listar = async (cantidad) => {
    const sql = `SELECT id, lugar, celular, direccion, eliminado from oficina
         order by id desc limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);

    return [rows, rows.length];
  };

  listarDestino = async () => {
    const sql = `SELECT id, destino as nombre from destinos`;
    const [rows] = await pool1.query(sql);
    return rows;
  };

  insertar = async (datos, cantidad) => {
    const sqlExists = `SELECT * FROM oficina WHERE id = ${pool.escape(datos.lugar)}`;
    const [result] = await pool.query(sqlExists);


    if (result.length === 0) {

      const sqlExists = `SELECT * FROM destinos WHERE id = ${pool.escape(datos.lugar)}`;
      const [result] = await pool1.query(sqlExists);
      datos.id = result[0].id
      datos.lugar = result[0].destino
      await pool.query("INSERT INTO oficina SET  ?", datos);
      return await this.listar(cantidad);
    } else {
      return {
        existe: 1,
      };
    }
  };

  actualizar = async (datos) => {
    const sql_ = `UPDATE oficina SET
                  direccion = ${pool.escape(datos.direccion)},
                  celular = ${pool.escape(datos.celular)},
                  eliminado = ${pool.escape(datos.estado)},
                  modificado = ${pool.escape(datos.modificado)},
                  usuario = ${pool.escape(datos.usuario)}
                  WHERE id = ${pool.escape(datos.idOld)}`;
    await pool.query(sql_);

    // console.log(datos, ' datos de la ofi',)


    return await this.listar(datos.cantidad)
  };

  listarSiguiente = async (id, cantidad) => {
    // console.log(id, 'siguiente')
    const sql = `SELECT id, lugar, celular, direccion, eliminado from oficina
            WHERE id < ${pool.escape(id)} ORDER by id DESC  limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    return rows;
  };

  listarAnterior = async (id, cantidad) => {
    console.log(id, "llamanda funcion anterior establecimientos");

    const sql = `SELECT id, lugar, celular, direccion, eliminado from oficina
            WHERE id > ${pool.escape(id)} limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    rows.reverse();
    return rows;
  };

  buscar = async (dato) => {
    const sql = `SELECT id, lugar, celular, direccion, eliminado from oficina
            where lugar like '${dato}%'`;
    const [rows] = await pool.query(sql);
    return rows;
  };
}
