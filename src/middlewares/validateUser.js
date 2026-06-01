const Joi = require('joi');
const { User } = require('../../models'); 

// 1. ESQUEMA DE CREACIÓN DE USUARIO (CON MIN 6 MÁS ESTRICTO Y SEGURO)
const createUserSchema = Joi.object({
  nickName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'El nickName debe ser texto.',
      'string.empty': 'El nickName no puede estar vacío.',
      'string.min': 'El nickName debe tener al menos 3 caracteres.',
      'string.max': 'El nickName no puede tener más de 30 caracteres.',
      'any.required': 'El nickName es obligatorio.'
    }),

  firstName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El firstName no puede tener más de 50 caracteres.'
    }),

  lastName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El lastName no puede tener más de 50 caracteres.'
    }),

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido.',
      'any.required': 'El email es obligatorio.'
    }),

  password: Joi.string()
    .trim() // Añadido para limpiar espacios accidentales antes de medir
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.min': 'La password debe tener al menos 6 caracteres.',
      'any.required': 'La password es obligatoria.'
    })
});

// 2. VALIDAR CREACIÓN
const validarCreacionUsuario = (req, res, next) => {
  const { error, value } = createUserSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({ errors: mensajes });
  }

  req.body = value; 
  return next(); 
};

// 3. VALIDAR UNICIDAD NICKNAME
const validarUnicidadNickName = async (req, res, next) => {
  const { nickName } = req.body;

  try {
    const usuarioExistente = await User.findOne({
      where: { nickName }
    });

    if (usuarioExistente) {
      return res.status(400).json({ errors: ['El nickName ya está en uso.'] });
    }

    return next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    return res.status(500).json({ errors: ['Error interno al validar usuario.', err.message] });
  }
};

// 4. VALIDAR UNICIDAD EMAIL
const validarUnicidadMail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const mailExistente = await User.findOne({
      where: { email }
    });

    if (mailExistente) {
      return res.status(400).json({ errors: ['El email ya está en uso.'] });
    }

    return next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    return res.status(500).json({ errors: ['Error interno al validar usuario.', err.message] });
  }
};

// 5. VALIDAR EXISTENCIA DE USUARIO (UNIFICADO AL FORMATO DE ERRORS EN ARRAY)
const validarUsuarioExiste = async (req, res, next) => {
  const idUser = req.params.idUser || req.body.idUser;

  if (!idUser) {
    return res.status(400).json({ errors: ['Falta el idUser en la solicitud.'] });
  }

  try {
    const user = await User.findByPk(idUser);
    if (!user) {
      return res.status(404).json({ errors: [`Usuario con ID ${idUser} no encontrado.`] });
    }
    return next();
  } catch (error) {
    console.error('Error en validarUsuarioExiste:', error);
    return res.status(500).json({ errors: ['Error verificando existencia del usuario.', error.message] });
  }
};

// 6. ESQUEMA DE ACTUALIZACIÓN
const createUpdateUserSchema = Joi.object({
  nickName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .optional()
    .messages({
      'string.base': 'El nickName debe ser texto.',
      'string.empty': 'El nickName no puede estar vacío.',
      'string.min': 'El nickName debe tener al menos 3 caracteres.',
      'string.max': 'El nickName no puede tener más de 30 caracteres.'
    }),

  firstName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El firstName no puede tener más de 50 caracteres.'
    }),

  lastName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El lastName no puede tener más de 50 caracteres.'
    }),

  email: Joi.string()
    .trim()
    .email()
    .optional()
    .messages({
      'string.email': 'El email debe tener un formato válido.'
    }),

  password: Joi.string()
    .trim()
    .min(6)
    .max(100)
    .optional()
    .messages({
      'string.min': 'La password debe tener al menos 6 caracteres.'
    })
});

// 7. VALIDAR UPDATE
const validarUpdateUsuario = (req, res, next) => {
  const { error, value } = createUpdateUserSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({ errors: mensajes });
  }

  req.body = value;
  return next();
};

// 8. VALIDAR EMAIL EN UPDATE
const validarEmailUpdate = async (req, res, next) => {
  const { email } = req.body;

  if (typeof email === 'undefined') {
    return next();
  }

  try {
    const usuarioExistente = await User.findOne({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({ errors: ['El email ya está en uso.'] });
    }

    return next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    return res.status(500).json({ errors: ['Error interno al validar usuario.', err.message] });
  }
};

// 9. VALIDAR NICKNAME EN UPDATE
const validarNickNameUpdate = async (req, res, next) => {
  const { nickName } = req.body;

  if (typeof nickName === 'undefined') {
    return next();
  }

  try {
    const usuarioExistente = await User.findOne({
      where: { nickName }
    });

    if (usuarioExistente) {
      return res.status(400).json({ errors: ['El nickName ya está en uso.'] });
    }

    return next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    return res.status(500).json({ errors: ['Error interno al validar usuario.', err.message] });
  }
};

module.exports = {
  validarCreacionUsuario,
  validarUnicidadNickName,
  validarUnicidadMail,
  validarUsuarioExiste,
  validarUpdateUsuario,
  validarEmailUpdate,
  validarNickNameUpdate
};