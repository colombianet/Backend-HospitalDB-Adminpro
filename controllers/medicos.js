const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    // con la función populate me traigo los datos del campo relacionado desde otra tabla, donde el 1er
    // parámetro es el nombre del campo relacionado y el 2do los campos q deseo traer del mismo (siempre viene el id)
    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });
}

const crearMedico = async(req, res = response) => {
    // En el modelo del médico se requiere se envíe el id del usuario q lo creó, a este campo se le
    // asignó el nombre 'usuario', al pasar por el middleware que valida el JWT, se asigna a la solicitud
    // este id para que al crear el médico(aquí) este id se le asigne al médico q creo y de esta forma saber
    // que usuario creó este médico (por motivos de seguridad)(relaciones entre tablas o colecciones)
    const uid = req.uid;
    const medico = new Medico({ usuario: uid, ...req.body })

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error inesperado, hable con el administrador'
        });

    }
}

const actualizarMedico = (req, res = response) => {
    res.json({
        ok: true,
        message: 'actualizarMedico'
    });
}

const borrarMedico = (req, res = response) => {
    res.json({
        ok: true,
        message: 'borrarMedico'
    });
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}