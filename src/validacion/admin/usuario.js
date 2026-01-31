import { check } from "express-validator";
import { validaciones } from "../headers.js";

export const insertar = [
  check("cantidad").isLength({ min: 1 }).exists().isNumeric(),

  check("ci")
    .matches(/^\d{5,15}((\s|[-])\d{1}[A-Z]{1})?$/)
    .exists(),
  check("nombre")
    .matches(/^.{4,3000}$/)
    .exists(),
  check("celular")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("correo").matches(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/),
  check("especialidad").isLength({ min: 1 }).exists().isNumeric(),
  check("rol_").isLength({ min: 1 }).exists().isNumeric(),
  check("entidad").isLength({ min: 1 }).exists().isNumeric(),
  check("contraseña")
    .matches(/^.{1,1500}$/s)
    .exists(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

export const actualizar = [
  check("id")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("ci")
    .matches(/^\d{5,15}((\s|[-])\d{1}[A-Z]{1})?$/)
    .exists(),
  check("nombre")
    .matches(/^.{4,3000}$/)
    .exists(),
  check("celular")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("correo").matches(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/),
  check("especialidad").isLength({ min: 1 }).exists().isNumeric(),
  check("rol_").isLength({ min: 1 }).exists().isNumeric(),
  check("entidad").isLength({ min: 1 }).exists().isNumeric(),
  check("cantidad").isLength({ min: 1 }).exists().isNumeric(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

export const recet = [
  check("id")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("otros")
    .matches(/^.{4,3000}$/)
    .exists(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

export const actualizarMiPerfil = [

  check("nombre")
    .matches(/^[a-zA-ZÑñ áéíóúÁÉÍÓÚ.]{2,3000}$/)
    .exists(),
  check("celular")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("correo").matches(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

export const cambiarMiContraseña = [
  check("pass1").exists().isLength({ min: 5 }),
  check("pass2").exists().isLength({ min: 5 }),
  (req, res, next) => {
    validaciones(req, res, next);
  },
];

export const buscar = [
  check("dato")
    .matches(/^[()/a-zA-Z.@ Ññ0-9_-]{1,400}$/)
    .exists(),
  (req, res, next) => {
    validaciones(req, res, next);
  },
];

export const siguiente = [
  check("cantidad").isLength({ min: 1 }).exists().isNumeric(),
  check("id").isLength({ min: 1 }).exists().isNumeric(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

export const anterior = [
  check("cantidad").isLength({ min: 1 }).exists().isNumeric(),
  check("id").isLength({ min: 1 }).exists().isNumeric(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

// buscar
