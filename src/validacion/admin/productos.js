
import { check } from "express-validator";
import { validaciones } from "../headers.js";

export const insertar = [

  check('producto')
    .matches(/^.{0,1000}$/s)
    .exists(),
  check('beneficios')
    .matches(/^.{1,4000}$/s),
  check('estado')
    .isLength({ min: 1 })
    .exists().isNumeric(),
  check('categoria')
    .isLength({ min: 1 })
    .exists().isNumeric(),

  (req, res, next) => {
    validaciones(req, res, next)
  }
]

export const editar = [
  check('id')
    .isLength({ min: 1 })
    .exists().isNumeric(),
  check('producto')
    .matches(/^.{0,1000}$/s)
    .exists(),
  check('beneficios')
    .matches(/^.{1,4000}$/s),
  check('estado')
    .isLength({ min: 1 })
    .exists().isNumeric(),
  check('categoria')
    .isLength({ min: 1 })
    .exists().isNumeric(),

  (req, res, next) => {
    validaciones(req, res, next)
  }
]

