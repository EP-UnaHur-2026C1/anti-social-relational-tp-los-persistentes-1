const mongoose = require("mongoose"); // mongoose para definir el esquema de la publicación

const postSchema = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // referencia al usuario que hizo la publicación
    description: { type: String, required: true, trim: true }, // texto de la publicación
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], // referencia a los tags asociados a la publicación
    imagen: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostImage' }] // referencia a las imágenes asociadas a la publicación
}, {
    timestamps: true, // para agregar campos de fecha de creación y actualización automáticamente
    strict: true, // para evitar que se agreguen campos no definidos en el esquema
    toJSON: { // para configurar cómo se convierte el documento a JSON
        virtuals: true, // para incluir los campos virtuales al convertir el documento a JSON
        transform: (_, ret) => { // para eliminar campos innecesarios al convertir el documento a JSON
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

module.exports = mongoose.model('Post', postSchema); // exportamos el modelo de publicación para usarlo en otras partes de la aplicación
