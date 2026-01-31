
import pool from '../bdConfig.js'

export class Servicios {


    listar = async () => {
        const sql =
            `SELECT cs.id, cs.servicio, e.id as identidad, e.entidad, cs.proce
            FROM catalogo_servicios cs
            inner join entidad e on e.id = cs.entidad order by cs.id desc
            `;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarEntidad = async () => {
        const sql =
            `SELECT id, entidad as label FROM entidad where estado = 1`
        const [rows] = await pool.query(sql)
        return rows
    }

    insertar = async (datos) => {
        const [result] = await pool.query("INSERT INTO catalogo_servicios SET  ?", datos)
        if (result.insertId > 0) {
            return result.insertId
        } else return { error: 1 }
    }


    actualizarImagen = async () => {
        return await this.listar()
    }

    actualizar = async (datos) => {
        const sql_ = `UPDATE catalogo_servicios SET
                        entidad = ${pool.escape(datos.entidad)},
                        proce = ${pool.escape(datos.proce)},
                        servicio = ${pool.escape(datos.servicio)},
                        editing = ${pool.escape(datos.editing)},
                        usuario = ${pool.escape(datos.usuario)}
                        WHERE id = ${pool.escape(datos.id)}`;
        await pool.query(sql_);
        return
    }

    eliminarImagen = async (id) => {
        const sql_ = `delete from catalogo_servicios 
                        WHERE id = ${pool.escape(id)}`;
        const [res] = await pool.query(sql_);
        const lista = await this.listar()
        return [lista, res.affectedRows]
    }

}
