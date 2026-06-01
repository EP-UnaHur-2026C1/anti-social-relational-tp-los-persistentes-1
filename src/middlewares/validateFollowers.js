const { User } = require('../db/models'); 

const validarFollow = async (req, res, next) => {
  try {
    const { idFollower, idFollowing } = req.body; 

    if (idFollower === idFollowing) {
      return res.status(400).json({ errors: ['Un usuario no puede seguirse a sí mismo.'] });
    }

    const [follower, following] = await Promise.all([
      User.findByPk(idFollower),
      User.findByPk(idFollowing)
    ]);

    if (!follower || !following) {
      return res.status(404).json({ errors: ['Usuario seguidor o seguido no encontrado.'] });
    }

    next();
  } catch (error) {
    res.status(500).json({ errors: ['Error al validar el seguimiento.'] });
  }
};

module.exports = { validarFollow };