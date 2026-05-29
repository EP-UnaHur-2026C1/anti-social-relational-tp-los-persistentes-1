// Para evitar problemas que tenia con createdAt/updatedAt en la tabla puente, modelo 
// PostTags explícitamente y conecto Post/Tag a ese modelo.
// Si se encuentra otra manera mas limpia se puede cambiar.

"use strict";
const { Model } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  class PostTag extends Model { // associate para definir las relaciones entre modelos. 
  // Un PostTag pertenece a un Post y un PostTag pertenece a un Tag
    static associate(models) {
      PostTag.belongsTo(models.Post, {
        foreignKey: "idPost",
        as: "post",
      });

      PostTag.belongsTo(models.Tag, {
        foreignKey: "idTag",
        as: "tag",
      });
    }
  }

  PostTag.init( // definición de los campos del modelo PostTag, con idPost 
  // e idTag como claves primarias compuestas que también son claves 
  // foráneas que no pueden ser nulas, lo que hace que cada 
  // combinación de post y tag sea única en la tabla puente de la 
  // relación many to many (MTM) entre Post y Tag
    {
      idPost: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      idTag: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PostTag",
      tableName: "PostTags",
      timestamps: true,
    }
  );

  return PostTag;
};