const { Router } = require('express');
const commentControllers = require('../controllers/commentControllers'); // importo los controladores de comment

const router = Router();

router.post('/', commentControllers.crearComentario);
router.get('/', commentControllers.obtenerComentarios);
router.get('/:idComment', commentControllers.obtenerComentario);
router.put('/:idComment', commentControllers.actualizarComentario);
router.delete('/:idComment', commentControllers.eliminarComentario);

module.exports = router;