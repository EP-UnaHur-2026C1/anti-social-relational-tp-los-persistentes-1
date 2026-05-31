const Joi = require('joi');
const { User } = require('../../models');

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
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    req.body = value;
    next();
  } catch (error) {
    console.error('Error en validarCreacionPost:', error);
    res.status(500).json({ message: 'Error interno al validar el post.', details: error.message });
  }
};

module.exports = {
  validarCreacionPost,
};
