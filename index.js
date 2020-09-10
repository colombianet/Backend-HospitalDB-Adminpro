// Variables de Entorno
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Inicializando servidor express
const app = express();

// Configurando CORS para crossdomain
app.use(cors())

// Obtención del body y parseo
app.use(express.json());

// Conexión con la BD
dbConnection();

// Acceso a carpeta pública
app.use(express.static('public'));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});