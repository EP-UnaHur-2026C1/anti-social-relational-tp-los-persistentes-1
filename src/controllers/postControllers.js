const { Post, PostImage, Comment, Tag, User } = require('../../models');

// 1. CREAR UNA PUBLICACIÓN
const crearPublicacion = async (req, res) => {
  try {
    const { idUser, description } = req.body;
    if (!idUser || !description) {
      return res.status(400).json({ errors: ['idUser y description son requeridos.'] });
    }

    // Verificar que exista el usuario
    const usuario = await User.findByPk(idUser);
    if (!usuario) {
      return res.status(404).json({ errors: ['Usuario no encontrado.'] });
    }

    const post = await Post.create({ idUser, description });
    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al crear la publicación.', error.message] });
  }
};

// 2. OBTENER PUBLICACIÓN POR ID CON IMÁGENES
const obtenerPost = async (req, res) => {
  try {
    const { idPost } = req.params;
    const post = await Post.findByPk(idPost, {
      include: [
        { model: PostImage, as: 'images', attributes: ['idImage', 'imageUrl'] },
        { model: Comment, as: 'comments', include: [{ model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] }] },
        { model: Tag, as: 'tags', attributes: ['idTag', 'name'] },
        { model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] },
      ],
    });
    if (!post) {
      return res.status(404).json({ errors: ['Post no encontrado.'] });
    }

    const plainPost = post.toJSON();
    // Validamos que existan comentarios antes de filtrar para evitar errores de tipo undefined
    if (plainPost.comments) {
      plainPost.comments = plainPost.comments.filter((comment) => comment.visible);
    }

    return res.status(200).json(plainPost);
  } catch (error) {
    return res.status(500).json({ errors: ['Error al obtener el post.', error.message] });
  }
};

// 3. AGREGAR UNA IMAGEN A UN POST
const agregarImagen = async (req, res) => {
  try {
    const { idPost } = req.params;
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ errors: ['imageUrl es requerido.'] });
    }

    const post = await Post.findByPk(idPost);
    if (!post) {
      return res.status(404).json({ errors: ['Post no encontrado.'] });
    }

    const nuevaImagen = await PostImage.create({ idPost, imageUrl });
    return res.status(201).json(nuevaImagen);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al agregar imagen.', error.message] });
  }
};

// 4. ELIMINAR UNA IMAGEN DEL POST
const eliminarImagen = async (req, res) => {
  try {
    const { idPost, idImage } = req.params;

    const imagen = await PostImage.findOne({ where: { idImage, idPost } });
    if (!imagen) {
      return res.status(404).json({ errors: ['Imagen no encontrada para ese post.'] });
    }

    await imagen.destroy();
    return res.status(200).json({ message: 'Imagen eliminada correctamente.' });
  } catch (error) {
    return res.status(500).json({ errors: ['Error al eliminar la imagen.', error.message] });
  }
};

// 5. OBTENER TODOS LOS POSTS
const obtenerTodosLosPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: PostImage, as: 'images', attributes: ['idImage', 'imageUrl'] },
        { model: Comment, as: 'comments', include: [{ model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] }] },
        { model: Tag, as: 'tags', attributes: ['idTag', 'name'] },
        { model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const postsConFiltro = posts.map((post) => {
      const plainPost = post.toJSON();
      if (plainPost.comments) {
        plainPost.comments = plainPost.comments.filter((comment) => comment.visible);
      }
      return plainPost;
    });

    return res.status(200).json(postsConFiltro);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al obtener posts.', error.message] });
  }
};

// 6. ACTUALIZAR DESCRIPCIÓN DEL POST
const actualizarDescripcionPost = async (req, res) => {
  try {
    const { idPost } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ errors: ['La descripción es requerida.'] });
    }

    const post = await Post.findByPk(idPost);
    if (!post) {
      return res.status(404).json({ errors: ['Post no encontrado.'] });
    }

    await post.update({ description });
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al actualizar el post.', error.message] });
  }
};

// 7. ELIMINAR UN POST
const eliminarPost = async (req, res) => {
  try {
    const { idPost } = req.params;

    const post = await Post.findByPk(idPost);
    if (!post) {
      return res.status(404).json({ errors: ['Post no encontrado.'] });
    }

    await post.destroy();
    return res.status(200).json({ message: 'Post eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al eliminar el post.', error.message] });
  }
};

module.exports = {
  crearPublicacion,
  obtenerPost,
  agregarImagen,
  eliminarImagen,
  obtenerTodosLosPosts,
  actualizarDescripcionPost,
  eliminarPost,
};