const Joi = require('joi');
const { User, Post } = require('../../models');

// Esquema de validación con Joi para la creación de publicaciones
const createPostSchema = Joi.object({
  idUser: Joi.number()
    .required()
    .messages({
      'number.base': 'El ID de usuario debe ser un número.',
      'any.required': 'Debe indicar a qué usuario pertenece el post.',
    }),
  description: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'La descripción no puede estar vacía.',
      'any.required': 'La descripción es obligatoria.',
    }),
});

// Middleware para validar el cuerpo de la petición al crear un Post
const validarCreacionPost = async (req, res, next) => {
  const { error, value } = createPostSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({ errors: mensajes });
  }

  try {
    const usuario = await User.findByPk(value.idUser);
    if (!usuario) {
      return res.status(404).json({ errors: ['Usuario no encontrado.'] }); 
    }

    req.body = value;
    return next();
  } catch (error) {
    console.error('Error en validarCreacionPost:', error);
    return res.status(500).json({ errors: ['Error interno al validar el post.'] });
  }
};

// Middleware para proteger las rutas que requieren un idPost específico
const validateExistePost = async (req, res, next) => {
  const { idPost } = req.params;

  try {
    const post = await Post.findByPk(idPost);

    if (!post) {
      return res.status(404).json({ errors: [`Publicación con ID ${idPost} no encontrada.`] });
    }

    // Guardamos la instancia del post en el objeto req para que el controlador la use directamente
    req.post = post;
    return next();
  } catch (error) {
    console.error('Error al validar existencia del post:', error);
    return res.status(500).json({ errors: ['Error interno del servidor al validar el post.'] });
  }
};

module.exports = {
  validarCreacionPost,
  validateExistePost,
};