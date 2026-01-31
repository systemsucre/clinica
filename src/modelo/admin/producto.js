import pool from "../bdConfig.js";

export class Productos {

  // publico
  buscarPorTexto = async (dato) => {
    const sql = `SELECT p.id, p.categoria as idcategoria, p.producto, p.id as img, p.beneficios, p.estado, c.id as categoria, c.categoria as nombrecategoria,c.color2,c.color3
            from productos p
            inner join categorias c on p.categoria = c.id
            where (p.producto like '${dato}%' or
            c.categoria like '${dato}%') and p.estado !=0
            ORDER by p.id asc`;
    const [rows] = await pool.query(sql);
    return rows;
  };

  buscarPorCategoria = async (id) => {
    const sql = `SELECT p.id, p.categoria as idcategoria, p.producto, p.id as img, p.beneficios, p.estado, c.id as categoria, c.categoria as nombrecategoria,c.color2,c.color3
            from productos p
            inner join categorias c on p.categoria = c.id
            where c.id = ${pool.escape(id)} and p.estado !=0
            ORDER by p.id asc`;
    const [rows] = await pool.query(sql);
    return rows;
  };

  // admin
  listar = async (cantidad) => {
    console.log(cantidad)
    const sql = `SELECT p.id, p.producto, p.beneficios, p.estado, c.id as idcategoria, c.categoria, p.estado
            from productos p
            inner join categorias c on p.categoria = c.id
            where p.estado !=0
            ORDER by p.id desc limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    const sqlCantidad = `select count(id) as cantidad from productos where estado !=0`
    const [resCantidad] = await pool.query(sqlCantidad)
    return [rows, resCantidad[0].cantidad];
  };
  listarCategorias = async () => {
    const sql =
      `SELECT id, categoria as label FROM categorias`
    const [rows] = await pool.query(sql)
    return rows
  }



  insertar = async (datos, cantidad) => {
    const [result] = await pool.query("INSERT INTO productos SET  ?", datos);
    if (result.insertId > 0) {
      const lis = await result.insertId
      return lis;
    }
    else return [false, []]
  };


  actualizarImagen = async (cantidad) => {
    return await this.listar(parseInt(cantidad))
  }



  actualizar = async (datos) => {

    const sql = `UPDATE productos SET
                producto = ${pool.escape(datos.producto)},
                categoria = ${pool.escape(datos.categoria)},
                beneficios = ${pool.escape(datos.beneficios)},
                estado = ${pool.escape(datos.estado)},
                editing = ${pool.escape(datos.fecha_)},
                usuario = ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)}`;

    const [rows] = await pool.query(sql);
    // console.log(rows)
    if (rows.affectedRows > 0) return true
    else return false
  };


  eliminarImagen = async (datos) => {
    const sql = `UPDATE productos SET
                estado = 0,
                editing = ${pool.escape(datos.fecha_)},
                usuario = ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)}`;
    const [rows] = await pool.query(sql);
    if (rows.affectedRows > 0) {
      const data = await this.listar(datos.cantidad)

      return [data, true]

    } else {
      return [[], false]
    }
  };


  buscar = async (dato, ) => {
    // console.log('los datos han llegado', dato)
    const sql = `SELECT p.id, p.producto, p.beneficios, p.estado, c.id as idcategoria, c.categoria, p.estado
            from productos p
            inner join categorias c on p.categoria = c.id
            where (p.producto like '${dato}%' or
            c.categoria like '${dato}%') and  p.estado !=0
            ORDER by p.id asc`;
    const [rows] = await pool.query(sql);
    return rows;
  };

  listarSiguiente = async (id, cantidad) => {
    const sql = `SELECT p.id, p.producto, p.beneficios, p.estado, c.id as idcategoria, c.categoria, p.estado
            from productos p
            inner join categorias c on p.categoria = c.id
            where p.id < ${pool.escape(id)} and p.estado !=0 ORDER by p.id DESC  limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    console.log("los datos han llegado", id);
    return rows;
  };
  listarAnterior = async (id, cantidad) => {
    const sql = `SELECT p.id, p.producto, p.beneficios, p.estado, c.id as idcategoria, c.categoria, p.estado
            from productos p
            inner join categorias c on p.categoria = c.id
            WHERE p.id > ${pool.escape(id)} and p.estado !=0 
            limit ${pool.escape(cantidad)}`;
    const [rows] = await pool.query(sql);
    rows.reverse();
    return rows;
  };
}
