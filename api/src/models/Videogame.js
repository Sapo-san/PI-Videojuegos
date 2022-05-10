const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    web_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    background_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });
};
