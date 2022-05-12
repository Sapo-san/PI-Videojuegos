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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      // cuando se abren los detalles del juego
      // el front avisa al back que traiga la
      // descr desde al la API y actualice este valor

      // tener cuidado con juegos creados por usuario...
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
    },
    platforms: {
      type: DataTypes.STRING,
      allowNull: false
      // se guardan como los slug y
      // separadas por espacios
    },
    /* genres: {
      type: DataTypes.STRING,
      allowNull: false
      // se guardan como los slug y
      // separadas por espacios
    } */
  });
};
