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

module.exports = { // exportar las funciones para que puedan ser utilizadas en las rutas
  crearPublicacion,
  obtenerPost,
  agregarImagen,
  eliminarImagen,
};
