// Ruta /api/login

const { Router } = require('express');
const { login } = require('../controllers/auth');
const { check } = require('express-validator');

// Middleware q devuelve el log de errores de las validaciones en caso q lo haya
const { validarCampos } = require('../middlewares/valida-campos');

const router = Router();

router.post('/', [
    check('email', 'El email es requerido').isEmail(),
    check('password', 'El password es requerido').not().isEmpty(),
    validarCampos
], login);

module.exports = router;