const response = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generaToken } = require('../helpers/jwt');

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

module.exports = {
    login
}