const path = require('path');
const fs = require('fs');

const { response, request } = require('express');
// Librería para asignar nombre único a nuestras imágenes
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizarImagen');

const fileUpload = async(req = request, res = response) => {
    const tabla = req.params.tabla;
    const id = req.params.id;

    // Valido tabla o colección en la url de la petición
    const tiposValidos = ['medicos', 'hospitales', 'usuarios'];

    if (!tiposValidos.includes(tabla)) {
        return res.status(400).json({
            ok: true,
            message: 'Las colecciones válidas son: medicos/hospitales/usuarios'
        });
    }

    // Validar que adjunte o envíe una imagen
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'Es necesario anexar una imagen a la solicitud'
        })
    }

    // Procesar imagen: tengo acceso a la imagen por middleware 'router.use(expressFileUpload())' en index
    const file = req.files.imagen;

    // Corto por los puntos y obtengo solo la extensión
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extensión archivo
    const extensionesValidas = ['jpg', 'jpeg', 'gif', 'png'];
    if (!extensionArchivo.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            message: 'La extensiones válidas son: jpg, png, gif y jpeg'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    const path = `./uploads/${ tabla }/${ nombreArchivo }`;

    // Mover la imagen
    file.mv(path, (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                message: 'Error al mover la imagen'
            });
        }

        // Anexar o borrar y agregar la nueva imagen si ya tenía una asignada
        actualizarImagen(id, nombreArchivo, tabla);

        res.json({
            ok: true,
            message: 'Imagen subida',
            nombreArchivo
        });

    });

}

// devuelve imagen anexando el nombre y extensión de la misma en la solicitud
const getImagen = async(req = request, res = response) => {

    const tabla = req.params.tabla;
    const foto = req.params.foto;

    // path imagen a buscar
    const pathImagen = path.join(__dirname, `../uploads/${ tabla }/${ foto }`);

    // path imagen por defecto (si no existe)
    const pathDefecto = path.join(__dirname, `../uploads/no-image.png`);

    if (fs.existsSync(pathImagen)) {

        res.sendFile(pathImagen);

    } else {

        res.sendFile(pathDefecto);

    }
}

module.exports = {
    fileUpload,
    getImagen
}