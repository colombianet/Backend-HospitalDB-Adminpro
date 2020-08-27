const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
});

UsuarioSchema.method('toJSON', function() {
    // Separo los campos q no deseo me devuelvan mis solicitudes
    const { __v, _id, password, ...object } = this.toObject();
    // Le anexo una nueva propiedad al objeto de mi esquema para mostrar el campo _id como uid 
    object.uid = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);