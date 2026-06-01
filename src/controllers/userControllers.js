const { User } = require('../../models');
const ATRIBUTOS_EXCLUIDOS = ['updatedAt']; 

// 1. CREAR USUARIO 
const crearUsuario = async (req, res) => {
    const { nickName, firstName, lastName, email, password } = req.body; 
    try {
        const nuevoUsuario = await User.create({
            nickName,
            firstName,
            lastName,
            email,
            password 
        });

        const usuarioRespuesta = nuevoUsuario.toJSON();
        delete usuarioRespuesta.password;

        // return explícito para despachar la respuesta y cerrar el flujo
        return res.status(201).json(usuarioRespuesta);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ errors: ['Error interno al crear el usuario.', error.message] });
    }
};

// 2. OBTENER TODOS LOS USUARIOS 
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            attributes: { exclude: ['password', ...ATRIBUTOS_EXCLUIDOS] }
        });
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ errors: ['Error al obtener la lista de usuarios.', error.message] });
    }
};

// 3. OBTENER UN USUARIO POR ID 
const obtenerUsuario = async (req, res) => {
    const { idUser } = req.params; 
    try {
        const usuario = await User.findByPk(idUser, { 
            attributes: { exclude: ['password', ...ATRIBUTOS_EXCLUIDOS] } 
        });
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ errors: [`Error al obtener el usuario con ID ${idUser}.`, error.message] });
    }
};

// 4. ACTUALIZAR USUARIO 
const actualizarUsuario = async (req, res) => {
    const { idUser } = req.params;
    const updateData = req.body;

    try {
        let usuario = await User.findByPk(idUser);
        delete updateData.idUser; // Evita que alteren la clave primaria

        usuario = await usuario.update(updateData);
        
        const usuarioRespuesta = usuario.toJSON();
        delete usuarioRespuesta.password;

        return res.status(200).json(usuarioRespuesta);

    } catch (error) {
        return res.status(500).json({ errors: ['Error al actualizar el usuario.', error.message] });
    }
};

// 5. ELIMINAR USUARIO
const eliminarUsuario = async (req, res) => {
    const { idUser } = req.params;
    try {
        await User.destroy({
            where: { idUser }
        });

        return res.status(200).json({ message: `Usuario ID: ${idUser} eliminado correctamente.` });
        
    } catch (error) {
        return res.status(500).json({ 
            errors: ['Error al eliminar el usuario. Revise si tiene publicaciones/comentarios asociados.', error.message] 
        });
    }
};

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
};