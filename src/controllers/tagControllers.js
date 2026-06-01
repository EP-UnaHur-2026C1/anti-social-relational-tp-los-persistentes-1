const { Tag, Post } = require('../../models'); 

// 1. CREAR UN TAG
const crearTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ errors: ['El nombre es requerido.'] });
    }

    const tag = await Tag.create({ name }); 
    return res.status(201).json(tag);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al crear el tag.', error.message] });
  }
};

// 2. OBTENER TODOS LOS TAGS
const obtenerTags = async (_req, res) => {
  try {
    const tags = await Tag.findAll({ 
      include: [{ model: Post, as: 'posts', attributes: ['idPost', 'description'] }] 
    }); 
    return res.status(200).json(tags);
  } catch (error) {
    return res.status(500).json({ errors: ['Error al obtener los tags.', error.message] });
  }
};

// 3. OBTENER UN TAG POR ID
const obtenerTag = async (req, res) => {
  try {
    const { idTag } = req.params;
    const tag = await Tag.findByPk(idTag, { 
      include: [{ model: Post, as: 'posts', attributes: ['idPost', 'description'] }],
    });

    if (!tag) {
      return res.status(404).json({ errors: ['Tag no encontrado.'] });
    }

    return res.status(200).json(tag);
  } catch (error) {
    return res.status(500).json({ errors: ['Error al obtener el tag.', error.message] });
  }
};

// 4. ACTUALIZAR UN TAG
const actualizarTag = async (req, res) => {
  try {
    const { idTag } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ errors: ['El nombre es requerido.'] });
    }

    const tag = await Tag.findByPk(idTag); 
    if (!tag) {
      return res.status(404).json({ errors: ['Tag no encontrado.'] });
    }

    await tag.update({ name }); 
    return res.status(200).json(tag);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al actualizar el tag.', error.message] });
  }
};

// 5. ELIMINAR UN TAG
const eliminarTag = async (req, res) => {
  try {
    const { idTag } = req.params;
    const tag = await Tag.findByPk(idTag);

    if (!tag) {
      return res.status(404).json({ errors: ['Tag no encontrado.'] });
    }

    await tag.destroy(); 
    return res.status(200).json({ message: 'Tag eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ errors: ['Error al eliminar el tag.', error.message] });
  }
};

// 6. ASIGNAR UN TAG A UN POST (Muchos a Muchos)
const asignarTagApost = async (req, res) => {
  try {
    const { idPost, idTag } = req.params;

    const [post, tag] = await Promise.all([
      Post.findByPk(idPost), 
      Tag.findByPk(idTag)
    ]); 

    if (!post) {
      return res.status(404).json({ errors: ['Post no encontrado.'] });
    }

    if (!tag) {
      return res.status(404).json({ errors: ['Tag no encontrado.'] });
    }

    await post.addTag(tag);
    return res.status(200).json({ message: 'Tag asignado al post correctamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ['Error al asignar tag al post.', error.message] });
  }
};

// 7. QUITAR UN TAG DE UN POST
const quitarTagDePost = async (req, res) => {
  try {
    const { idPost, idTag } = req.params;

    const [post, tag] = await Promise.all([
      Post.findByPk(idPost), 
      Tag.findByPk(idTag)
    ]); 

    if (!post) {
      return res.status(404).json({ errors: ['Post no encontrado.'] });
    }

    if (!tag) {
      return res.status(404).json({ errors: ['Tag no encontrado.'] });
    }

    await post.removeTag(tag); 
    return res.status(200).json({ message: 'Tag quitado del post correctamente.' });
  } catch (error) {
    return res.status(500).json({ errors: ['Error al quitar tag del post.', error.message] });
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