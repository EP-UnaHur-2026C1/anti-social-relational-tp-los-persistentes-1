const { User, sequelize } = require('../../models'); 
const ATRIBUTOS_EXCLUIDOS_USER = ['password', 'email', 'updatedAt'];

// GESTIÓN DE RELACIONES

// SEGUIR USUARIO
const seguirUsuario = async (req, res) => {
    const { followerId, followingId } = req.params;

    if (followerId === followingId) {
        return res.status(400).json({ errors: ['Un usuario no puede seguirse a sí mismo.'] });
    }

    try {
        const follower = await User.findByPk(followerId);
        const following = await User.findByPk(followingId);

        if (!follower || !following) {
            return res.status(404).json({ errors: ['Uno o ambos usuarios no fueron encontrados.'] });
        }

        // Sequelize genera addSeguido por el alias "Seguidos"
        await follower.addSeguido(followingId);

        res.status(201).json({ 
            message: `Usuario ${followerId} ahora sigue a ${followingId}.`,
            followerId: parseInt(followerId),
            followingId: parseInt(followingId)
        });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ errors: ['El usuario ya sigue a este otro usuario.'] });
        }
        res.status(500).json({ errors: ['Error al seguir al usuario.', error.message] });
    }
};

// DEJAR DE SEGUIR USUARIO 
const dejarDeSeguirUsuario = async (req, res) => {
    const { followerId, followingId } = req.params;

    try {
        const follower = await User.findByPk(followerId);
        const following = await User.findByPk(followingId);

        if (!follower || !following) {
            return res.status(404).json({ errors: ['Uno o ambos usuarios no fueron encontrados.'] });
        }

        // Usamos hasSeguido para verificar la relación existente
        const loSigue = await follower.hasSeguido(followingId);
        if (!loSigue) {
            return res.status(404).json({ errors: ['La relación de seguimiento no existía.'] });
        }

        // Usamos removeSeguido para eliminar el vínculo
        await follower.removeSeguido(followingId);

        res.status(200).json({ message: `El usuario ID: ${followerId} dejó de seguir al Usuario ID: ${followingId}.` });

    } catch (error) {
        res.status(500).json({ errors: ['Error al dejar de seguir al usuario.', error.message] });
    }
};


// FUNCIONES DE LECTURA (LISTAS)

// OBTENER LISTA DE SEGUIDOS
const obtenerSeguidos = async (req, res) => {
    const { followerId } = req.params;

    try {
        const usuario = await User.findByPk(followerId, {
            attributes: ['idUser', 'nickName'],
            include: [{
                model: sequelize.models.User,
                as: 'Seguidos', // CORREGIDO: Mismo alias que el modelo User
                attributes: { exclude: ATRIBUTOS_EXCLUIDOS_USER },
                through: { attributes: [] } 
            }]
        });

        if (!usuario) {
            return res.status(404).json({ errors: [`Usuario con ID ${followerId} no encontrado.`] });
        }
        
        res.status(200).json({
            idUser: usuario.idUser,
            nickName: usuario.nickName,
            followings: usuario.Seguidos // Devuelve la lista bajo la propiedad adaptada
        });

    } catch (error) {
        res.status(500).json({ errors: ['Error al obtener la lista de seguidos.', error.message] });
    }
};

// OBTENER LISTA DE SEGUIDORES
const obtenerSeguidores = async (req, res) => {
    const { followerId } = req.params;

    try {
        const usuario = await User.findByPk(followerId, {
            attributes: ['idUser', 'nickName'],
            include: [{
                model: sequelize.models.User,
                as: 'Seguidores', // CORREGIDO: Mismo alias que el modelo User
                attributes: { exclude: ATRIBUTOS_EXCLUIDOS_USER },
                through: { attributes: [] }
            }]
        });

        if (!usuario) {
            return res.status(404).json({ errors: [`Usuario con ID ${followerId} no encontrado.`] });
        }

        res.status(200).json({
            idUser: usuario.idUser,
            nickName: usuario.nickName,
            followers: usuario.Seguidores // Devuelve la lista bajo la propiedad adaptada
        });

    } catch (error) {
        res.status(500).json({ errors: ['Error al obtener la lista de seguidores.', error.message] });
    }
};


module.exports = {
    seguirUsuario,
    dejarDeSeguirUsuario,
    obtenerSeguidos,
    obtenerSeguidores
};