const { Tag, Post } = require('../../models'); // importo los modelos necesarios para manejar las relaciones entre tags y posts

const crearTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'el nombre es requerido' });
    }

    const tag = await Tag.create({ name }); // crear un nuevo tag con el nombre dado en el cuerpo de la solicitud
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el tag', details: error.message });
  }
};

const obtenerTags = async (_req, res) => {
  try {
    const tags = await Tag.findAll({ include: [{ model: Post, as: 'posts', attributes: ['idPost', 'description'] }] }); // obtener todos los tags, incluyendo los posts asociados a cada tag, pero solo con los campos idPost y description de cada post
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los tags', details: error.message });
  }
};

const obtenerTag = async (req, res) => {
  try {
    const { idTag } = req.params;
    const tag = await Tag.findByPk(idTag, { // obtener un tag por su ID, incluyendo los posts asociados a ese tag, pero solo con los campos idPost y description de cada post
      include: [{ model: Post, as: 'posts', attributes: ['idPost', 'description'] }],
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag no encontrado' });
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el tag', details: error.message });
  }
};

const actualizarTag = async (req, res) => {
  try {
    const { idTag } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'el nombre es requerido' });
    }

    const tag = await Tag.findByPk(idTag); // buscar el tag por su ID para asegurarse de que existe antes de intentar actualizarlo
    if (!tag) {
      return res.status(404).json({ message: 'Tag no encontrado' });
    }

    await tag.update({ name }); // actualizar el nombre del tag con el nuevo valor dado en el cuerpo de la solicitud
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el tag', details: error.message });
  }
};

const eliminarTag = async (req, res) => {
  try {
    const { idTag } = req.params;
    const tag = await Tag.findByPk(idTag);

    if (!tag) {
      return res.status(404).json({ message: 'Tag no encontrado' });
    }

    await tag.destroy(); // eliminar el tag encontrado por su ID, lo que también eliminará las asociaciones con los posts debido a la relación many to many (MTM) definida en los modelos
    res.status(200).json({ message: 'Tag eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el tag', details: error.message });
  }
};

const asignarTagApost = async (req, res) => {
  try {
    const { idPost, idTag } = req.params;

    const [post, tag] = await Promise.all([Post.findByPk(idPost), Tag.findByPk(idTag)]); // buscar el post y el tag por sus respectivos IDs para asegurarse de que ambos existen antes de intentar asignar el tag al post

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    if (!tag) {
      return res.status(404).json({ message: 'Tag no encontrado' });
    }

    await post.addTag(tag);
    res.status(200).json({ message: 'Tag asignado al post correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar tag al post', details: error.message });
  }
};

const quitarTagDePost = async (req, res) => {
  try {
    const { idPost, idTag } = req.params;

    const [post, tag] = await Promise.all([Post.findByPk(idPost), Tag.findByPk(idTag)]); // buscar el post y el tag por sus respectivos IDs para asegurarse de que ambos existen antes de intentar quitar el tag del post

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    if (!tag) {
      return res.status(404).json({ message: 'Tag no encontrado' });
    }

    await post.removeTag(tag); // quitar la asociación entre el post y el tag, lo que no elimina ni el post ni el tag, solo la relación entre ambos en la tabla puente de la relación many to many (MTM)
    res.status(200).json({ message: 'Tag quitado del post correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al quitar tag del post', details: error.message });
  }
};

module.exports = {
  crearTag,
  obtenerTags,
  obtenerTag,
  actualizarTag,
  eliminarTag,
  asignarTagApost,
  quitarTagDePost,
};