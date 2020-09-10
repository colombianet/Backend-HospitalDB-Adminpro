// Ruta /api/todo

const { Router } = require('express');
const { check } = require('express-validator');

const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');
const { validarCampos } = require('../middlewares/valida-campos');
const { validaToken } = require('../middlewares/valida-token');

const router = Router();

router.get('/:busqueda', validaToken, getTodo);

router.get('/coleccion/:tabla/:busqueda', validaToken, getDocumentosColeccion);

module.exports = router;