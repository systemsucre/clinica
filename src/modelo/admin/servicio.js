import pool from "../bdConfig.js";

export class Servicio {

  // DATOS PUBLICOS 
  getServices = async () => {
    const sql = `SELECT c.id, c.servicio, e.entidad  from catalogo_servicios c 
                  inner join entidad e on e.id = c.entidad
    `;
    const [rows] = await pool.query(sql);
    return rows;
  };

  getService = async (id) => {
    const sql = `SELECT c.id, c.servicio, e.entidad, c.proce as proc from catalogo_servicios c 
    inner join entidad e on e.id = c.entidad where c.id = ${pool.escape(id)} `;
    const [rows] = await pool.query(sql);
    return rows;
  };

}
