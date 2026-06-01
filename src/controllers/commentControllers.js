const { Comment, Post, User } = require('../../models'); 

// 1. CREAR UN COMENTARIO
const crearComentario = async (req, res) => {
  try {
    const { idPost, idUser, content } = req.body; 

    if (!idPost || !idUser || !content) {
      return res.status(400).json({ errors: ['idPost, idUser y content son requeridos.'] });
    }

    // Buscamos ambos en paralelo para optimizar rendimiento
    const [post, user] = await Promise.all([
      Post.findByPk(idPost),
      User.findByPk(idUser),
    ]);

    if (!post) {
      return res.status(404).json({ errors: ['Post no encontrado.'] });
    }

    if (!user) {
      return res.status(404).json({ errors: ['Usuario no encontrado.'] });
    }

    const comentario = await Comment.create({ idPost, idUser, content }); 
    return res.status(201).json(comentario); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al crear el comentario.', error.message] });
  }
};

// 2. OBTENER TODOS LOS COMENTARIOS
const obtenerComentarios = async (_req, res) => {
  try {
    const comentarios = await Comment.findAll({ 
      include: [
        { model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] },
        { model: Post, as: 'post', attributes: ['idPost', 'description'] },
      ],
      order: [['createdAt', 'DESC']], 
    });

    return res.status(200).json(comentarios); 
  } catch (error) {
    return res.status(500).json({ errors: ['Error al obtener los comentarios.', error.message] });
  }
};

// 3. OBTENER UN COMENTARIO POR ID
const obtenerComentario = async (req, res) => {
  try {
    const { idComment } = req.params; 
    const comentario = await Comment.findByPk(idComment, {
      include: [
        { model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] },
        { model: Post, as: 'post', attributes: ['idPost', 'description'] },
      ],
    });

    if (!comentario) {
      return res.status(404).json({ errors: ['Comentario no encontrado.'] });
    }

    return res.status(200).json(comentario); 
  } catch (error) {
    return res.status(500).json({ errors: ['Error al obtener el comentario.', error.message] });
  }
};

// 4. ACTUALIZAR UN COMENTARIO
const actualizarComentario = async (req, res) => { 
  try {
    const { idComment } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ errors: ['content es requerido.'] });
    }

    const comentario = await Comment.findByPk(idComment);
    if (!comentario) {
      return res.status(404).json({ errors: ['Comentario no encontrado.'] });
    }

    await comentario.update({ content });
    return res.status(200).json(comentario); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al actualizar el comentario.', error.message] });
  }
};

// 5. ELIMINAR UN COMENTARIO
const eliminarComentario = async (req, res) => { 
  try {
    const { idComment } = req.params;
    const comentario = await Comment.findByPk(idComment); 

    if (!comentario) {
      return res.status(404).json({ errors: ['Comentario no encontrado.'] });
    }

    await comentario.destroy();
    return res.status(200).json({ message: 'Comentario eliminado correctamente.' }); 
  } catch (error) {
    return res.status(500).json({ errors: ['Error al eliminar el comentario.', error.message] });
  }
};

module.exports = {
  crearComentario,
  obtenerComentarios,
  obtenerComentario,
  actualizarComentario,
  eliminarComentario,
};