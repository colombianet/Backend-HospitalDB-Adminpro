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

        // Si entró aquí el token fué válido, tomo el uid del usuario q hace la soliictud por motivos de 
        // seguridad Y si el usuario hace un delete, update..., que este quede identificado
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