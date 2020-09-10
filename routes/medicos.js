// Ruta /api/medicos

const { Router } = require('express');
const { check } = require('express-validator');

const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/valida-campos');
const { validaToken } = require('../middlewares/valida-token');

const router = Router();

router.get('/', getMedicos);

router.post('/', [
    validaToken,
    check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
    check('hospital', 'El id del hospital no es válido').isMongoId(),
    validarCampos
], crearMedico);

router.delete('/:id', [], borrarMedico);

router.put('/:id', [], actualizarMedico);

module.exports = router;