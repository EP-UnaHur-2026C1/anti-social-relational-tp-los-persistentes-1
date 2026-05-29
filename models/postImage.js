"use strict";
const { Model } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  class PostImage extends Model {
    static associate(models) { // associate para definir las relaciones entre modelos. Un PostImage pertenece a un Post
      PostImage.belongsTo(models.Post, {
        foreignKey: "idPost",
        as: "post",
      });
    }
  }

  PostImage.init( // definición de los campos del modelo PostImage, con idImage como clave primaria autoincremental, idPost como clave foránea que no puede ser nula, y imageUrl como cadena que no puede ser nula
    {
      idImage: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idPost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PostImage",
      tableName: "PostImages",
      timestamps: false,
    }
  );

  return PostImage;
};
