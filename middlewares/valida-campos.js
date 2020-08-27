const { validationResult } = require('express-validator');
const { response } = require('express');

const validarCampos = (req, res = response, next) => {

    // log de errores (en caso que los haya) por librería 'express-validator' y los anexo a la solicitud
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos
}