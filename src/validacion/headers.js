
import { validationResult } from "express-validator"
export const validaciones = (req, res, next) => {
    // console.log("DATOS EN LA CABECERA: ",req.body)
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            console.log('no pasa validaciones', req.body, error.errors[0].param,)
            return res.json({ msg: 'Verifique que el campo: "' +error.errors[0].param+'" esté bien escrito!', ok: false, data:error.errors[0].param })
        }
        return next()
    }
    catch (error) {
        console.log(error)
    }
}