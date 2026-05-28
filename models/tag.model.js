//Tag: Etiqueta que puede ser asignada a un post. 
// Una etiqueta puede estar asociada a muchos posts, y un post puede tener múltiples etiquetas.

const mongoose = require("mongoose"); // mongoose para definir el esquema de las etiquetas

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }, // nombre de la etiqueta, es única para evitar etiquetas duplicadas, y se le quitan los espacios al inicio y al final
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] // referencia a los posts asociados a la etiqueta, es un array porque una etiqueta puede estar asociada a muchos posts
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

const Tag = mongoose.model('Tag', tagSchema) // creamos el modelo de etiquetas a partir del esquema definido

module.exports = Tag; // exportamos el modelo de etiquetas para usarlo en otras partes de la aplicación
