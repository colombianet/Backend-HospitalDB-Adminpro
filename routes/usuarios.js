// Ruta /api/usuarios

const { Router } = require('express');
const { getUsuarios, crearUsuarios, actualizarUsuarios, borrarUsuario } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');
const { validaToken } = require('../middlewares/valida-token');

const router = Router();

router.get('/', validaToken, getUsuarios);

router.post('/', [
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('email', 'El email es requerido').isEmail(),
    check('password', 'El password es requerido').not().isEmpty(),
    validarCampos
], crearUsuarios);

router.delete('/:id', [validaToken], borrarUsuario);

router.put('/:id', [
    validaToken,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('email', 'El email es requerido').isEmail(),
    check('role', 'El role es requerido').not().isEmpty(),
    validarCampos
], actualizarUsuarios);

module.exports = router;