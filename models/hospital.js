const { Schema, model } = require('mongoose');

// El segundo parámetro en new Schema, es por que al agregar la coleccion a la BD, mongoose 
// le coloca al final una s (cosas del inglés) y agregando este parámetro, decimos exactamente
// como queremos que se llame la colección en la BD
const HospitalSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    }
}, { collection: 'hospitales' });

HospitalSchema.method('toJSON', function() {
    // Separo los campos q no deseo me devuelvan mis solicitudes
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Hospital', HospitalSchema);