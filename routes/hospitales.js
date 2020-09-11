// Ruta /api/hospitales

const { Router } = require('express');
const { check } = require('express-validator');

const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');
const { validarCampos } = require('../middlewares/valida-campos');
const { validaToken } = require('../middlewares/valida-token');

const router = Router();

router.get('/', getHospitales);

router.post('/', [
    validaToken,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos
], crearHospital);

router.delete('/:id', [validaToken], borrarHospital);

router.put('/:id', [
    validaToken,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos
], actualizarHospital);

module.exports = router;