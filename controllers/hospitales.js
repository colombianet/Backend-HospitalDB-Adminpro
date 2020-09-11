const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');
    res.json({
        ok: true,
        hospitales
    });
}

const crearHospital = async(req, res = response) => {
    const uid = req.uid;
    // Asigno el id del usuario que hizo la solicitud (al validar el JWT) al campo usuario del modelo 
    // del hospital ya que es requerido y así relaciono las 2 tablas o colecciones
    const hospital = new Hospital({ usuario: uid, ...req.body });

    try {

        const hospitalDB = await hospital.save();
        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error inesperado, hable con el administrador'
        });
    }
}

const actualizarHospital = async(req, res = response) => {

    // id del usuario q se va a actualizar en la BD
    const id = req.params.id;
    // id del usuario q está realizando la actualización
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById(id);
        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un Hospital con ese ID'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            message: 'Registro actualizado',
            hospital: hospitalActualizado
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error, hable con el administrador'
        });

    }

}

const borrarHospital = async(req, res = response) => {

    // id del usuario q se va a actualizar en la BD
    const id = req.params.id;

    try {

        const hospitalDB = await Hospital.findById(id);
        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un Hospital con ese ID'
            });
        }

        await Hospital.findByIdAndDelete(id);

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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}