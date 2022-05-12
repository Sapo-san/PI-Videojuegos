const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('genre', {
    web_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  }, {
    timestamps: false
  });
};