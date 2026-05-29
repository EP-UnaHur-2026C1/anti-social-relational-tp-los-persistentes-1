'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) { // función para crear la tabla PostTags, con idPost 
  // e idTag como claves primarias compuestas que también son claves foráneas que no pueden 
  // ser nulas, lo que hace que cada combinación de post y tag sea única en la tabla 
  // puente de la relación many to many (MTM) entre Post y Tag, y referencias a las 
  // tablas Posts y Tags respectivamente, con onUpdate y onDelete en CASCADE para 
  // mantener la integridad referencial, y campos createdAt y updatedAt para registrar 
  // las fechas de creación y actualización de cada registro en la tabla PostTags
    await queryInterface.createTable('PostTags', { // nombre de la tabla puente para la relación many to many (MTM) entre Post y Tag
      idPost: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Posts',
          key: 'idPost',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      idTag: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Tags',
          key: 'idTag',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) { // función para eliminar la tabla PostTags, lo 
  // que también elimina todas las asociaciones entre posts y tags en la relación 
  // many to many (MTM) entre Post y Tag, pero no elimina ni los posts ni los 
  // tags, solo la tabla puente que registra las asociaciones entre ambos
    await queryInterface.dropTable('PostTags');
  },
};