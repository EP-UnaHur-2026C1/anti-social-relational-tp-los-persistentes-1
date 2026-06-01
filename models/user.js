"use strict";
const { Model } = require("sequelize"); 
module.exports = function(sequelize, DataTypes) {
  class User extends Model {
    static associate(models) {
      // 1. Relación 1:M con Post
      User.hasMany(models.Post, {
        foreignKey: "idUser",
        as: "posts",
      });

      // 2. Relación 1:M con Comment
      User.hasMany(models.Comment, {
        foreignKey: "idUser",
        as: "comments",
      });

      // RELACIÓN AUTORREFERENCIAL DE SEGUIDORES (MUCHOS A MUCHOS)
      
      // Usuarios a los que este usuario sigue (Seguidos)
      User.belongsToMany(models.User, {
        as: "Seguidos",          // Alias único para los usuarios que sigo
        through: "Followers",      // Tabla intermedia unificada en SQLite
        foreignKey: "followerId",  // Clave del usuario que realiza la acción de seguir
        otherKey: "followingId",   // Clave del usuario que es seguido
        timestamps: false          // Desactiva la búsqueda de campos createdAt/updatedAt
      });

      // Usuarios que siguen a este usuario (Seguidores)
      User.belongsToMany(models.User, {
        as: "Seguidores",           // Alias único para los usuarios que me siguen
        through: "Followers",      // Apunta exactamente a la misma tabla 'Followers'
        foreignKey: "followingId", // Clave del usuario que es seguido
        otherKey: "followerId",    // Clave del usuario que realiza la acción de seguir
        timestamps: false
      });
    }
  }

  User.init( 
    {
      idUser: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nickName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );
  return User;
};