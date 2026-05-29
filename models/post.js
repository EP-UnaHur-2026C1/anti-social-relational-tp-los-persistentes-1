"use strict";
const { Model } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
	class Post extends Model { // associate para definir las relaciones entre modelos. Un Post pertenece a un User y un Post tiene muchas imágenes
		static associate(models) {
			// un Post pertenece a un User
			Post.belongsTo(models.User, { // pertenece a un User, con la clave foránea idUser y el alias "user" para acceder al usuario desde el post
				foreignKey: "idUser",
				as: "user",
			});

			// un Post puede tener muchas imágenes
			Post.hasMany(models.PostImage, { // tiene muchas imágenes, con la clave foránea idPost y el alias "images" para acceder a las imágenes desde el post, además se establece onDelete: "CASCADE" para eliminar las imágenes asociadas cuando se elimina un post
				foreignKey: "idPost",
				as: "images",
				onDelete: "CASCADE",
				hooks: true,
			});

			Post.hasMany(models.Comment, { // un Post tiene muchos comentarios, con la clave foránea idPost y el alias "comments" para acceder a los comentarios desde el post, además se establece onDelete: "CASCADE" para eliminar los comentarios asociados cuando se elimina un post
				foreignKey: "idPost",
				as: "comments",
				onDelete: "CASCADE",
				hooks: true,
			});

			Post.belongsToMany(models.Tag, {
				through: models.PostTag,
				foreignKey: 'idPost',
				otherKey: 'idTag',
				as: 'tags',
			});
		}
	}

	Post.init( // definición de los campos del modelo Post, con idPost como clave primaria autoincremental, idUser como clave foránea que no puede ser nula, y description como texto que tampoco puede ser nulo
		{
			idPost: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idUser: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Post",
			tableName: "Posts",
			timestamps: true,
		}
	);

	return Post;
};
