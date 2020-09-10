const { Schema, model } = require('mongoose');

const MedicoSchema = new Schema({
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
    },
    hospital: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Hospital'
    }
}, { collection: 'medicos' });

MedicoSchema.method('toJSON', function() {
    // Separo los campos q no deseo me devuelvan mis solicitudes
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Medico', MedicoSchema);