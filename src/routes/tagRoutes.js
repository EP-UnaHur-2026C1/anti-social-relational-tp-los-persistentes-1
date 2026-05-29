const { Router } = require('express');
const tagControllers = require('../controllers/tagControllers'); // importo los controladores de tag

const router = Router();

router.post('/', tagControllers.crearTag);
router.get('/', tagControllers.obtenerTags);
router.get('/:idTag', tagControllers.obtenerTag);
router.put('/:idTag', tagControllers.actualizarTag);
router.delete('/:idTag', tagControllers.eliminarTag);
router.post('/post/:idPost/tag/:idTag', tagControllers.asignarTagApost);
router.delete('/post/:idPost/tag/:idTag', tagControllers.quitarTagDePost);

module.exports = router;