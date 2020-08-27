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

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});