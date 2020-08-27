const { response } = require('express');
const jwt = require('jsonwebtoken');

const validaToken = (req, res = response, next) => {
    // Obtengo el token q debe ser enviado por los headers
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'Se necesita el token en la solicitud'
        });
    }

    try {
        // El uid fue enviado en el payload al generar el jwt
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        // Anexo el uid del usuario que hizo la solicitud, para devolverlo en el endpoint que desee
        req.uid = uid;
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'El token no es válido'
        });
    }

}

module.exports = {
    validaToken
}