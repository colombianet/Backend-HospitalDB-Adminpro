const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generaToken } = require('../helpers/jwt');

const getUsuarios = async(req = request, res = response) => {
    const desde = Number(req.query.desde) || 0;

    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //     .skip(desde)
    //     .limit(5);
    // const total = await Usuario.count();

    // Encadenamiento de promesas y se realicen las mismas de manera simultánea
    const [usuarios, total] = await Promise.all([

        Usuario.find({}, 'nombre email role google img')
        .skip(desde)
        .limit(5),

        Usuario.countDocuments()

    ]);

    // en el middleware validaToken anexé el uid del usuario a la solicitud (req.uid) 
    // para saber el usuario q solicita la información
    res.json({
        ok: true,
        usuarios,
        total
    });

}

const crearUsuarios = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                message: 'Este email ya existe'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save()

        // Generación del token
        const token = await generaToken(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error inesperado'
        })

    }

}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                message: 'No existe usuario con este Id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            message: 'Usuario eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error inesperado'
        });

    }

}

const actualizarUsuarios = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                message: 'No existe usuario con este Id'
            });
        }

        const { email, password, google, ...campos } = req.body;

        // Valido q el email del usuario q quiero actualizar sea diferente del q tiene el usuario actual (el q
        // encontré antes por el uid) y si no lo es, luego valido si el email (a actualizar) lo tiene algún
        // otro usuario en la BD, para q no caiga en la restricción unique del modelo
        if (email !== usuarioDB.email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    message: 'Este email ya está registrado'
                });
            }
        }

        // Aquí sé q el email no existe, por ende lo anexo a los campos q voy a actualizar en la BD 
        campos.email = email;
        // Con { new: true } hago q mongoose me devuelva el usuario con los campos actualizados
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error inesperado'
        })

    }

}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuarios,
    borrarUsuario
}