"use strict";
const { Model } = require("sequelize");

const getCommentVisibilityMonths = () => { // función para obtener el número de meses que un comentario debe ser visible, se lee de la variable de entorno COMMENT_VISIBLE_MONTHS o COMMENT_VISIBILITY_MONTHS, y 
// si no está definida se usa un valor por defecto de 6 meses
	const rawValue = process.env.COMMENT_VISIBLE_MONTHS || process.env.COMMENT_VISIBILITY_MONTHS || "6";
	const parsedValue = parseInt(rawValue, 10);
	return Number.isNaN(parsedValue) ? 6 : parsedValue; // si el valor no es un número válido, se devuelve el valor por defecto de 6 meses
};

const isCommentVisible = (createdAt) => { // función para determinar si un comentario es visible o no, se compara la fecha de creación del comentario con la fecha actual menos el número de meses de 
// visibilidad, si el comentario fue creado dentro del período de visibilidad se considera visible, de lo contrario se considera no visible. Si createdAt es null o undefined, se asume que el comentario 
// es visible para evitar ocultar comentarios sin fecha de creación válida
	if (!createdAt) return true;

	const thresholdMonths = getCommentVisibilityMonths();
	const cutoffDate = new Date();
	cutoffDate.setMonth(cutoffDate.getMonth() - thresholdMonths);

	return new Date(createdAt) >= cutoffDate;
};

module.exports = function (sequelize, DataTypes) { // definición del modelo Comment, con idComment como clave primaria autoincremental, idPost e idUser como claves foráneas que no pueden ser nulas, content como texto que tampoco puede ser nulo, y un campo virtual visible que se calcula en función de la fecha de creación del comentario
	class Comment extends Model {
		static associate(models) { // associate para definir las relaciones entre modelos. Un Comment pertenece a un User y un Comment pertenece a un Post
			Comment.belongsTo(models.User, {
				foreignKey: "idUser",
				as: "user",
			});

			Comment.belongsTo(models.Post, {
				foreignKey: "idPost",
				as: "post",
			});
		}
	}

	Comment.init( // definición de los campos del modelo Comment, con idComment como clave primaria autoincremental, idPost e idUser como claves foráneas que no pueden ser nulas, content como texto que tampoco puede ser nulo, y un campo virtual visible que se calcula en función de la fecha de creación del comentario
		{
			idComment: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idPost: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idUser: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			visible: {
				type: DataTypes.VIRTUAL,
				get() {
					return isCommentVisible(this.getDataValue("createdAt"));
				},
			},
		},
		{
			sequelize,
			modelName: "Comment",
			tableName: "Comments",
			timestamps: true,
		}
	);

	return Comment;
};
