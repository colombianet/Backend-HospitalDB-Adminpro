const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const { generaToken } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const Usuario = require('../models/usuario');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Validación del email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                message: 'No existe usuario con este email'
            });
        }

        // Validación del password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Password inválido'
            });
        }

        // Generación del token
        const token = await generaToken(usuarioDB.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        // Valido token con librebrías de google y desestructuro los campos q anexaré para crear mi usuario 
        const { name, email, picture } = await googleVerify(googleToken);
        let usuario;

        // Valido si el email de google ya existe en la BD para crear un nuevo usuario o tal vez el usuario usó
        // login normal(no por google) y quiera cambiar o tener acceso mediante lo 2 tipos de login(google-normal)
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            // Si no existe en la BD lo creo
            // Nota: aunque se asigne un password, este no servirá para loguearse x que debe estar encriptado
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // Si existe pueda q quiera pasar a autenticacion por google
            usuario = usuarioDB;
            usuario.google = true;
        }
        await usuario.save();

        // Generación del token
        const token = await generaToken(usuario.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }

}

const renewToken = async(req = request, res = response) => {
    const uid = req.uid;

    // Generación del token
    const token = await generaToken(uid);

    res.json({
        ok: true,
        token
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}