const { response, request } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

// Obtiene todos los registros q coincidad con el criterio de búsqueda sin importar la colección del mismo
const getTodo = async(req = request, res = response) => {
    const busqueda = req.params.busqueda;
    // Hago q el criterio de búsqueda sea insensible(!case-sensitive)
    const regexp = new RegExp(busqueda, 'i');

    // const usuarios = await Usuario.find({ nombre: regexp });
    // const medicos = await Medico.find({ nombre: regexp });
    // const hospitales = await Hospital.find({ nombre: regexp });

    // Hago q las promesas se lancen de manera simultanea(las 3 al mismo tiempo)
    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regexp }),
        Medico.find({ nombre: regexp }),
        Hospital.find({ nombre: regexp })
    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });
}

// Busca mediante un criterio pero solo en la colección de interés
const getDocumentosColeccion = async(req = request, res = response) => {
    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;
    const regexp = new RegExp(busqueda, 'i');
    let data = [];

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({ nombre: regexp });
            break;

        case 'medicos':
            data = await Medico.find({ nombre: regexp })
                .populate('usuario', 'nombre img')
                .populate('hospital', 'nombre img')
            break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regexp })
                .populate('usuario', 'nombre img')
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'Error: las colecciones disponibles son usuarios/medicos/hospitales'
            });
    }

    res.json({
        ok: true,
        usuarios: data
    });
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}