const { Post, PostImage, Comment, Tag, User } = require('../../models');

// crear una publicación
const crearPublicacion = async (req, res) => {
  try {
    const { idUser, description } = req.body;
    if (!idUser || !description) { // si falta alguno de los campos, se devuelve un error
      return res.status(400).json({ message: 'idUser y description son requeridos' });
    }

    // verificar que exista el usuario
    const usuario = await User.findByPk(idUser);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const post = await Post.create({ idUser, description });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la publicación', details: error.message });
  }
};

// obtener publicación por ID con imágenes
const obtenerPost = async (req, res) => {
  try {
    const { idPost } = req.params; // obtiene el ID del post desde los parámetros de la URL
    const post = await Post.findByPk(idPost, { // incluye las imágenes asociadas al post y el usuario que lo creó
      include: [
        { model: PostImage, as: 'images', attributes: ['idImage', 'imageUrl'] },
        { model: Comment, as: 'comments', include: [{ model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] }] },
        { model: Tag, as: 'tags', attributes: ['idTag', 'name'] },
        { model: User, as: 'user', attributes: ['idUser', 'nickName', 'firstName', 'lastName'] },
      ],
    });
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    const plainPost = post.toJSON();
    plainPost.comments = plainPost.comments.filter((comment) => comment.visible);

    res.status(200).json(plainPost);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el post', details: error.message });
  }
};

// agregar una imagen a un post
const agregarImagen = async (req, res) => {
  try {
    const { idPost } = req.params; // obtener el ID del post desde los parámetros de la URL
    const { imageUrl } = req.body; // obtener la URL de la imagen desde el cuerpo de la solicitud
    if (!imageUrl) return res.status(400).json({ message: 'imageUrl es requerido' });

    const post = await Post.findByPk(idPost);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    const nuevaImagen = await PostImage.create({ idPost, imageUrl }); // crear una nueva imagen asociada al post
    res.status(201).json(nuevaImagen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar imagen', details: error.message });
  }
};

// eliminar una imagen del post
const eliminarImagen = async (req, res) => {
  try {
    const { idPost, idImage } = req.params;

    const imagen = await PostImage.findOne({ where: { idImage, idPost } }); // buscar la imagen por su ID y el ID del post para asegurarse de que pertenece al post correcto
    if (!imagen) return res.status(404).json({ message: 'Imagen no encontrada para ese post' });

    await imagen.destroy();
    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la imagen', details: error.message });
  }
};

// obtener todos los posts
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

    // filtrar comentarios por visibilidad (comentarios creados dentro de los últimos 6 meses)
    const postsConFiltro = posts.map((post) => {
      const plainPost = post.toJSON();
      plainPost.comments = plainPost.comments.filter((comment) => comment.visible);
      return plainPost;
    });

    res.status(200).json(postsConFiltro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener posts', details: error.message });
  }
};

// actualizar descripción del post
const actualizarDescripcionPost = async (req, res) => {
  try {
    const { idPost } = req.params;
    const { description } = req.body;

    if (!description) return res.status(400).json({ message: 'La descripción es requerida' });

    const post = await Post.findByPk(idPost);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    await post.update({ description });
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el post', details: error.message });
  }
};

// eliminar un post
const eliminarPost = async (req, res) => {
  try {
    const { idPost } = req.params;

    const post = await Post.findByPk(idPost);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    await post.destroy(); // esto también eliminará las imágenes y comentarios asociados por el CASCADE
    res.status(200).json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el post', details: error.message });
  }
};

module.exports = { // exportar las funciones para que puedan ser utilizadas en las rutas
  crearPublicacion,
  obtenerPost,
  agregarImagen,
  eliminarImagen,
  obtenerTodosLosPosts,
  actualizarDescripcionPost,
  eliminarPost,
};
