const Joi = require('joi');
const { Comment, Post, User } = require('../../models');

const createCommentSchema = Joi.object({
  idPost: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El idPost debe ser un número.',
      'number.integer': 'El idPost debe ser un entero.',
      'number.positive': 'El idPost debe ser un número positivo.',
      'any.required': 'El idPost es obligatorio.',
    }),
  idUser: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El idUser debe ser un número.',
      'number.integer': 'El idUser debe ser un entero.',
      'number.positive': 'El idUser debe ser un número positivo.',
      'any.required': 'El idUser es obligatorio.',
    }),
  content: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.base': 'El contenido debe ser texto.',
      'string.empty': 'El contenido no puede estar vacío.',
      'string.min': 'El contenido no puede estar vacío.',
      'any.required': 'El content es obligatorio.',
    }),
});

const updateCommentSchema = Joi.object({
  content: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.base': 'El contenido debe ser texto.',
      'string.empty': 'El contenido no puede estar vacío.',
      'string.min': 'El contenido no puede estar vacío.',
      'any.required': 'El content es obligatorio.',
    }),
});

const validarCreacionComentario = async (req, res, next) => {
  const { error, value } = createCommentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const mensajes = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: mensajes });
  }

  try {
    const [post, user] = await Promise.all([
      Post.findByPk(value.idPost),
      User.findByPk(value.idUser),
    ]);

    // CORREGIDO: Todo unificado al formato { errors: [...] }
    if (!post) {
      return res.status(404).json({ errors: ['Post no encontrado.'] });
    }

    if (!user) {
      return res.status(404).json({ errors: ['Usuario no encontrado.'] });
    }

    req.body = value;
    next();
  } catch (err) {
    console.error('Error en validarCreacionComentario:', err);
    res.status(500).json({ errors: ['Error interno al validar el comentario.'] });
  }
};

const validarActualizacionComentario = (req, res, next) => {
  const { error, value } = updateCommentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const mensajes = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: mensajes });
  }

  req.body = value;
  next();
};

const commentExists = async (req, res, next) => {
  try {
    const { idComment } = req.params;
    const comentario = await Comment.findByPk(idComment);
    if (!comentario) {
      return res.status(404).json({ errors: [`Comentario con ID ${idComment} no encontrado.`] });
    }
    next();
  } catch (err) {
    console.error('Error commentExists:', err);
    res.status(500).json({ errors: ['Error interno al validar existencia del comentario.'] });
  }
};

module.exports = {
  validarCreacionComentario,
  validarActualizacionComentario,
  commentExists, // Exportado listo para commentRoutes.js
};