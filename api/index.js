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
const { populateDb } = require('./index-helper.js');


// Obtener info desde .env
const { HOSTING_PORT } = process.env;

/* Configuración de sequelize */
const connObj =  { force: true } // Syncing all the models at once.
//const connObj =  {} // Don't sync

/* Conectar con BD y luego correr servidor */
conn.sync(connObj).then(() => {
  server.listen(HOSTING_PORT, () => {
    console.log('Server iniciado, escuchando en el puerto', HOSTING_PORT); // eslint-disable-line no-console
    populateDb() // solo popula base de datos
  });
});
