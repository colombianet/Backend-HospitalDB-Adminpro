const jwt = require('jsonwebtoken');

// Hago q retorne una promesa para usar el await y esperar q esta se cumpla para poder continuar al consumirla
const generaToken = (uid) => {

    return new Promise((resolve, reject) => {
        const paylod = {
            uid
        };

        jwt.sign(paylod, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Error al generar el token');
            } else {
                resolve(token)
            }
        });

    });

}

module.exports = {
    generaToken
}