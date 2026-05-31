const { Router } = require('express');
const commentControllers = require('../controllers/commentControllers'); // importo los controladores de comment
const {
  validarCreacionComentario,
  validarActualizacionComentario,
} = require('../middlewares/validateComment');

const router = Router();

router.post('/', validarCreacionComentario, commentControllers.crearComentario);
router.get('/', commentControllers.obtenerComentarios);
router.get('/:idComment', commentControllers.obtenerComentario);
router.put('/:idComment', validarActualizacionComentario, commentControllers.actualizarComentario);
router.delete('/:idComment', commentControllers.eliminarComentario);

module.exports = router;