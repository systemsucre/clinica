
import { check } from "express-validator";
import { validaciones } from "../headers.js";

export const insertar = [

    check('entidad')
        .matches(/^.{0,1000}$/s)
        .exists(),
    check('servicio')
        .matches(/^.{1,4000}$/s),
    check('procedimiento')
        .matches(/^.{1,4000}$/s),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const editar = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),
    check('entidad')
        .matches(/^.{0,4000}$/s)
        .exists(),
    check('servicio')
        .matches(/^.{1,4000}$/s),
    check('procedimiento')
        .matches(/^.{1,4000}$/s),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const eliminar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('cantidad')
        .isLength({ min: 1 })
        .exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const id = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]





