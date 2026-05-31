const { Router } = require('express');
const postControllers = require('../controllers/postControllers'); // importo los controladores de post
const {
  validarCreacionPost,
} = require('../middlewares/validatePost');

const router = Router();

// Crear publicación
router.post('/', validarCreacionPost, postControllers.crearPublicacion); // ruta para crear una nueva publicación, se espera un JSON con idUser y description en el cuerpo de la solicitud

// Obtener publicación por id (incluye imágenes)
router.get('/:idPost', postControllers.obtenerPost); // ruta para obtener una publicación por su ID, se espera el ID del post como parámetro en la URL, devuelve el post con sus imágenes asociadas y el usuario que lo creó

// Agregar imagen a publicación
router.post('/:idPost/images', postControllers.agregarImagen); // ruta para agregar una imagen a una publicación, se espera el ID del post como parámetro en la URL y la URL de la imagen en el cuerpo de la solicitud

// Eliminar imagen de publicación
router.delete('/:idPost/images/:idImage', postControllers.eliminarImagen); // ruta para eliminar una imagen de una publicación, se espera el ID del post y el ID de la imagen como parámetros en la URL

module.exports = router;
