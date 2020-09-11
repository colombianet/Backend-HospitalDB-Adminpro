// Ruta /api/login

const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renewToken } = require('../controllers/auth');

// Middleware q devuelve el log de errores de las validaciones en caso q lo haya
const { validarCampos } = require('../middlewares/valida-campos');
const { validaToken } = require('../middlewares/valida-token');

const router = Router();

router.post('/', [
    check('email', 'El email es requerido').isEmail(),
    check('password', 'El password es requerido').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('token', 'El token de google es requerido').not().isEmpty(),
    validarCampos
], googleSignIn);

router.get('/renew', [
    validaToken
], renewToken);

module.exports = router;