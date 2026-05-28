
const mongoose = require("mongoose"); // mongoose para definir el esquema de las imágenes de los posts

const postImageSchema = new mongoose.Schema({
    // se podria agregar idPost para relacionar la imagen con un post específico, pero como el post ya tiene un array de imágenes, no es estrictamente necesario
    url: { type: String, required: true, unique: true } // URL de la imagen alojada. Debe ser única para evitar duplicados.
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

const PostImage = mongoose.model('PostImage', postImageSchema) // creamos el modelo de imágenes de los posts a partir del esquema definido

module.exports = PostImage; // exportamos el modelo de imágenes de los posts para usarlo en otras partes de la aplicación