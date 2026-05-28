const mongoose = require("mongoose"); // mongoose para definir el esquema de los comentarios

const commentSchema = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // referencia al usuario que hizo el comentario
    content: { type: String, required: true, trim: true, maxlength: 500 }, // texto del comentario, ponemos límite de 500 caracteres para evitar comentarios largos
    date: { type: Date, default: Date.now }, // fecha en la que fue realizado el comentario
    visible: { type: Boolean, default: true } // indicación de si el comentario está visible o no
}, {
    strict: true, // para evitar que se agreguen campos no definidos en el esquema
    toJSON: { // para configurar cómo se convierte el documento a JSON
        virtuals: true, // para incluir los campos virtuales al convertir el documento a JSON
        transform: (_, ret) => { // para eliminar campos innecesarios al convertir el documento a JSON
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})

const Comment = mongoose.model('Comment', commentSchema) // creamos el modelo de comentarios a partir del esquema definido

module.exports = Comment; // exportamos el modelo de comentarios para usarlo en otras partes de la aplicación