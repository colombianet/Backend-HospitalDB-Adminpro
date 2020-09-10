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

const actualizarHospital = (req, res = response) => {
    res.json({
        ok: true,
        message: 'actualizarHospital'
    });
}

const borrarHospital = (req, res = response) => {
    res.json({
        ok: true,
        message: 'deleteHospital'
    });
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}