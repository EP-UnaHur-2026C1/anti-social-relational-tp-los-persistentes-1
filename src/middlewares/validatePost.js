const Joi = require('joi');
// 1. Importamos también el modelo Post para poder buscarlo en la DB
const { User, Post } = require('../../models');

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
      // 2. MODIFICADO: Cambiado a 'errors' con array para que sea consistente con los otros middlewares
      return res.status(404).json({ errors: ['Usuario no encontrado.'] }); 
    }

    req.body = value;
    next();
  } catch (error) {
    console.error('Error en validarCreacionPost:', error);
    res.status(500).json({ errors: ['Error interno al validar el post.'] });
  }
};

// 3. El middleware que faltaba para proteger las rutas que usan :idPost
const validateExistePost = async (req, res, next) => {
  const { idPost } = req.params;

  try {
    const post = await Post.findByPk(idPost);

    if (!post) {
      return res.status(404).json({ errors: [`Publicación con ID ${idPost} no encontrada.`] });
    }

    // Guardamos el post en la req por si el controlador lo necesita usar
    req.post = post;
    next();
  } catch (error) {
    console.error('Error al validar existencia del post:', error);
    res.status(500).json({ errors: ['Error interno del servidor al validar el post.'] });
  }
};

module.exports = {
  validarCreacionPost,
  validateExistePost, // <-- Exportamos la nueva validación
};