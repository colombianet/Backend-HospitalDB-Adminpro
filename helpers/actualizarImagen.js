const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagenVieja = (path) => {
    if (fs.existsSync(path)) {
        // Borrar imagen vieja
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async(id, nombreArchivo, tabla) => {

    let pathViejo = '';

    switch (tabla) {

        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No existe un médico con ese id');
                return false;
            }

            // En caso que el usuario tenga una imagen asignada, la borro para anexar la nueva
            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagenVieja(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();

            return true;
            break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No existe un hospital con ese id');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagenVieja(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();

            return true;
            break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No existe un usuario con ese id');
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagenVieja(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();

            return true;
            break;

    }
}

module.exports = {
    actualizarImagen
}