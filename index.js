const express = require('express');
// Variables de Entorno
require('dotenv').config();

const cors = require('cors');

const { dbConnection } = require('./database/config');


// Configurando CORS
app.use(cors())

// Inicializando servidor express
const app = express();

// Conexión con la BD
dbConnection();

// mongodb+srv://strider:<password>@cluster0-p9hgm.mongodb.net/test
// mean_usser
// CYqSMP7wO00wD6zL


// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    });
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});