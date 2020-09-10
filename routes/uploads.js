// Ruta /api/upload

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { fileUpload, getImagen } = require('../controllers/uploads');
const { validaToken } = require('../middlewares/valida-token');

const router = Router();

// Middleware para subir imágenes
router.use(expressFileUpload());

router.put('/:tabla/:id', validaToken, fileUpload);
router.get('/:tabla/:foto', getImagen);


module.exports = router;