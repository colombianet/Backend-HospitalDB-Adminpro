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

const actualizarMedico = async(req, res = response) => {

    // id del usuario q se va a actualizar en la BD
    const id = req.params.id;
    // id del usuario q está realizando la actualización
    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById(id);
        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un médico con ese ID'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            message: 'Registro actualizado',
            medico: medicoActualizado
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, hable con el administrador'
        });

    }
}

const borrarMedico = async(req, res = response) => {

    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById(id);
        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un médico con ese ID'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            message: 'Registro eliminado'
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, hable con el administrador'
        });

    }

}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}