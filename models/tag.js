'use strict';
const { Model } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
	class Tag extends Model {
		static associate(models) { // define la relación many to many (MTM) entre Tag y Post a 
        // traves del modelo PostTag, que indica que un tag puede estar asociado a muchos 
        // posts y un post puede tener muchos tags, con las claves foráneas idTag e idPost 
        // respectivamente, y un alias 'posts' para acceder a los posts asociados a un tag
			Tag.belongsToMany(models.Post, {
				through: models.PostTag,
				foreignKey: 'idTag',
				otherKey: 'idPost',
				as: 'posts',
			});
		}
	}

	Tag.init( // definición de los campos del modelo Tag, con idTag como clave primaria 
    // autoincremental, y name como cadena que no puede ser nula ni repetida
		{
			idTag: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			modelName: 'Tag',
			tableName: 'Tags',
			timestamps: true,
		}
	);

	return Tag;
};
