const Joi = require('joi');
const { Tag } = require('../../models'); 

// Esquema de validación para el cuerpo de la petición (req.body)
const tagSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.base': 'El nombre debe ser texto',
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': 'El nombre debe tener al menos 1 carácter',
      'string.max': 'El nombre no puede exceder 50 caracteres',
      'any.required': 'El campo name es obligatorio'
    })
});

// Middleware para validar el formato del Tag al crearlo o editarlo
const validateTag = (req, res, next) => {
  const { error } = tagSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map((d) => d.message) });
  }

  next();
};

// Middleware para evitar Tags duplicados en la base de datos (Útil para el POST)
const validateTagNoExiste = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Buscamos si ya hay una etiqueta con ese nombre exacto
    const existente = await Tag.findOne({ where: { name } });
    if (existente) {
      return res.status(409).json({ errors: [`La etiqueta "${name}" ya existe.`] }); 
    }

    next();
  } catch (err) {
    console.error('Error validarTagNoExiste:', err);
    res.status(500).json({ errors: ['Error interno al validar etiqueta.'] });
  }
};

// Middleware para verificar que el Tag exista (Útil para GET por ID, PUT y DELETE)
const validateExisteTag = async (req, res, next) => {
  // 3. ADVERTENCIA: Asegurate de que en tu archivo 'tagRoutes.js' el parámetro de la URL se llame exactamente :idTag (ej: /tags/:idTag)
  const { idTag } = req.params; 

  try {
    const tag = await Tag.findByPk(idTag);

    if (!tag) {
      return res.status(404).json({ errors: [`Etiqueta con ID ${idTag} no encontrada.`] });
    }

    req.tag = tag; // Nos guardamos el tag en la req por si el controlador lo quiere usar directamente
    next();
  } catch (error) {
    console.error('Error al validar existencia de etiqueta:', error);
    res.status(500).json({ errors: ['Error interno del servidor.'] });
  }
};

module.exports = {
  validateTag,
  validateExisteTag,
  validateTagNoExiste
};