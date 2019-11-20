const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let lecturaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    temperatura: {
        type: Number,
        required: false
    },
    humedad: {
        type: Number,
        required: false
    },
    fecha: {
        type: Number,
        required: true
    },
    auditoria: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('lectura', lecturaSchema);