
import { check } from "express-validator";
import { validaciones } from "../headers.js";

export const insertar = [

    check('entidad')
        .matches(/^.{0,1000}$/s)
        .exists(),
    check('direccion')
        .matches(/^.{0,1000}$/s)
        .exists(),
    check('celular')
        .matches(/^.{0,1000}$/s)
        .exists(),
    check('distrito')
        .matches(/^.{0,1000}$/s)
        .exists(),
 
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const editar = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),
    check('entidad')
        .matches(/^.{0,1000}$/s)
        .exists(),
    check('direccion')
        .matches(/^.{0,1000}$/s)
        .exists(),
    check('celular')
        .matches(/^.{0,1000}$/s)
        .exists(),   check('facebook')
        .matches(/^.{0,2000}$/s),
    check('instagram')
        .matches(/^.{0,2000}$/s),
    check('youtube')
        .matches(/^.{0,2000}$/s),
    check('linkedin')
        .matches(/^.{0,2000}$/s),
    check('twitter')
        .matches(/^.{0,2000}$/s),
    check('distrito')
        .matches(/^.{0,1000}$/s)
        .exists(),
    check('estado')
        .matches(/^.{0,1000}$/s)
        .exists(),


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





