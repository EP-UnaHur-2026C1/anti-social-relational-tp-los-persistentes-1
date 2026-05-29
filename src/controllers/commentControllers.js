const { Comment, Post, User } = require('../../models'); // importación de los modelos necesarios para manejar los comentarios, publicaciones y usuarios

const crearComentario = async (req, res) => {
  try {
    const { idPost, idUser, content } = req.body; // obtener el ID del post, el ID del usuario y el contenido del comentario desde el cuerpo de la solicitud

    if (!idPost || !idUser || !content) {
      return res.status(400).json({ message: 'idPost, idUser y content son requeridos' });
    }

    const [post, user] = await Promise.all([
      Post.findByPk(idPost),
      User.findByPk(idUser),
    ]);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const comentario = await Comment.create({ idPost, idUser, content }); // crear un nuevo comentario asociado al post y al usuario
    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el comentario', details: error.message });
  }
};

const obtenerComentarios = async (_req, res) => {
  try {
    const comentarios = await Comment.findAll({ // obtener todos los comentarios, incluyendo el usuario que lo creó y el post al que pertenece, ordenados por fecha de creación descendente
      include: [
        { model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] },
        { model: Post, as: 'post', attributes: ['idPost', 'description'] },
      ],
      order: [['createdAt', 'DESC']], // ordenar por fecha de creación descendente para mostrar los comentarios más recientes primero
    });

    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los comentarios', details: error.message });
  }
};

const obtenerComentario = async (req, res) => {
  try {
    const { idComment } = req.params; // obtener el ID del comentario desde los parámetros de la URL
    const comentario = await Comment.findByPk(idComment, {
      include: [
        { model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] },
        { model: Post, as: 'post', attributes: ['idPost', 'description'] },
      ],
    });

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el comentario', details: error.message });
  }
};

const actualizarComentario = async (req, res) => { // actualizar el contenido de un comentario existente, se espera el ID del comentario como parámetro en la URL y el nuevo contenido en el cuerpo de la solicitud
  try {
    const { idComment } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'content es requerido' });
    }

    const comentario = await Comment.findByPk(idComment);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    await comentario.update({ content });
    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el comentario', details: error.message });
  }
};

const eliminarComentario = async (req, res) => { // eliminar un comentario existente, se espera el ID del comentario como parámetro en la URL
  try {
    const { idComment } = req.params;
    const comentario = await Comment.findByPk(idComment); // buscar el comentario por su ID para asegurarse de que existe antes de intentar eliminarlo

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    await comentario.destroy();
    res.status(200).json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el comentario', details: error.message });
  }
};

module.exports = {
  crearComentario,
  obtenerComentarios,
  obtenerComentario,
  actualizarComentario,
  eliminarComentario,
};