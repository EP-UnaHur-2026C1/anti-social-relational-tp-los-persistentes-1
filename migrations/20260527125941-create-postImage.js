'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) { // función para crear la tabla PostImages, con idImage como clave primaria autoincremental, idPost como clave foránea que no puede ser nula y referencia a la tabla Posts, y imageUrl como cadena que no puede ser nula
    await queryInterface.createTable('PostImages', {
      idImage: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idPost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts', // nombre exacto de la tabla de Posts
          key: 'idPost'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
      }
      
    });
  },

  async down(queryInterface, Sequelize) { // función para eliminar la tabla PostImages
    await queryInterface.dropTable('PostImages');
  }
};
