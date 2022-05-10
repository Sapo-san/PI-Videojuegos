//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const axios = require("axios")

const {
  HOSTING_PORT, API_KEY } = process.env;

// ------------ Llamado inicial a API de videojugos
async function PopulateDb() {
  /*
    IMPORTANTE: Cambiar sincronización de modelos de
    sequelize para evitar llamar a la api cada vez que
    se reinicia el server
  */
  console.log("### Revisión de datos inicial ###")
  const Videogame = conn.models["Videogame"]
  
  const testQuery = Videogame.findAll()
  testQuery.then(data => {
    console.log(data)
    if (data.length === 0) {
      // Si no hay dartos en DB, hacer fetch
      console.log("¡Base de datos vacía!")
      console.log("Llamando API...")


      /* axios.get('https://api.rawg.io/api/games?key=' + API_KEY).then(
        (response) => {
          // Lista de juegos
          // console.log(response.data.results)
          console.log("Respuesta obtenida, procesando...")
          const gameData = response.data.results.map((game) => {
            // si se modifica esta función, modificar tambien
            // el modelo 
            return {
              web_id: game.id,
              name: game.name,
              release_date: game.released, 
              background_image: game.background_image,
              rating: game.rating
            }
          })

         

          // insertar datos con sequelize...
          Videogame.bulkCreate(gameData).then(data => console.log(data[0]))

        }
      ).catch( (err) => {
        console.log("No se pudo obtener datos de API")
        console.log(err)
      }) */


    } else {
      console.log("Base ya está populada")
      console.log("### Revisión de datos terminada ###")
    }
  })
  /* const testQuery = Videogame.findAll({ limit: 1})
  console.log("resultado de la query", testQuery) */
}


// Syncing all the models at once.
//conn.sync({ force: true }).then(() => {

// Don't sync
conn.sync().then(() => {
  server.listen(HOSTING_PORT, () => {
    console.log('Server iniciado, escuchando en el puerto', HOSTING_PORT); // eslint-disable-line no-console
    PopulateDb()
  });
});
