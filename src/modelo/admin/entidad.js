
import pool from '../bdConfig.js'

export class Entidad {


    listar = async () => {
        const sql =
            `SELECT e.id, e.entidad, e.direccion, e.celular, d.distrito, d.id as iddistrito, d.distrito, m.municipio, r.red, 
            e.facebook, e.instagram, e.youtube, e.linkedin, e.twitter, e.estado
            FROM entidad e
            inner join distrito d on d.id = e.distrito 
            inner join municipio m on m.id = d.municipio
            inner join red r on r.id = m.red`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarDistrito = async () => {
        const sql =
            `SELECT id, distrito as label FROM distrito`
        const [rows] = await pool.query(sql)
        return rows
    }

    insertar = async (datos) => {

        const sqlExists = `SELECT * FROM entidad WHERE entidad = ${pool.escape(datos.entidad)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const [result] = await pool.query("INSERT INTO entidad SET  ?", datos)
            if (result.insertId > 0) {

                return await this.listar()
            } else return { error: 1 }

        } else {
            return {
                existe: 1,
            }
        }
    }

    actualizar = async (datos) => {

        const sqlExists =
            `SELECT * FROM entidad WHERE entidad = ${pool.escape(datos.entidad)} and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {

            const sql_ = `UPDATE entidad SET
                        distrito = ${pool.escape(datos.distrito)},
                        entidad = ${pool.escape(datos.entidad)},
                        celular = ${pool.escape(datos.celular)},
                        direccion = ${pool.escape(datos.direccion)},
                        facebook = ${pool.escape(datos.facebook)},
                        instagram = ${pool.escape(datos.instagram)},
                        linkedin = ${pool.escape(datos.linkedin)},
                        youtube = ${pool.escape(datos.youtube)},
                        twitter = ${pool.escape(datos.twitter)},
                        editing = ${pool.escape(datos.editing)},
                        usuario = ${pool.escape(datos.usuario)},
                        estado = ${pool.escape(datos.estado)}
                        WHERE id = ${pool.escape(datos.id)}`;
            await pool.query(sql_);
            return await this.listar()

        } else { return { error: 1 } }
    }

}
