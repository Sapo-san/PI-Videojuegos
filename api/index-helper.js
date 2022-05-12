const { conn } = require('./src/db.js');
const axios = require("axios")

const { API_KEY } = process.env;

const { Videogame, Genre } = require('./src/db.js');

let gameList = [];

// procesador de atributo de juego particular 
function atributeProcessor(pfArray, attribute) {
    let strArray = []
    for (let index = 0; index < pfArray.length; index++) {
        switch (attribute) {
            case "platforms":
                strArray.push(pfArray[index]["platform"]["slug"])
                break;
            case "genres":
                strArray.push(pfArray[index]["id"])
                break;
            default:
                console.log(pfArray[index])
                break;
        }
      
    }
    return strArray
  }

// procesa la info de un juego y devuelve Obj para ingresar a BD
function gameProcessor(game) {
    // si se modifica esta función, modificar tambien
    // el modelo 
    return {
        web_id: game.id,
        name: game.name,
        description: null, 
        release_date: game.released, 
        background_image: game.background_image,
        rating: game.rating,
        platforms: atributeProcessor(game.platforms, "platforms").join(" "),
        genres: atributeProcessor(game.genres, "genres")
    }
}

// recibe URL (para pedir lista de juegos) y numero para identificar request
// retorna promesa con info de juegos
async function infoRequester(url) {
    return axios.get(url + API_KEY)
}

async function insertAssociationsGamesGenres() {
    // Agregar asociaciones a cada juego
    for (let i = 0; i < gameList.length; i++) {
        let game = await Videogame.findByPk(gameList[i].web_id)
        game.addGenres(gameList[i].genres)
    }
    console.log(`--- Inserción de asociaciones GenreVideogame en BD exitosa ---`)
}

async function insertGamesintoDB(promise) {
    const resolvedPromise = await promise
    const gameData = resolvedPromise.data.results.map(gameProcessor)
    
    gameList = gameList.concat(gameData)

    // insertar datos con sequelize...
    return Videogame.bulkCreate(gameData).then( () => {
        // luego de insertar datos en BD
        console.log(`--- Inserción de juegos en BD exitosa ---`)
    })
}

async function insertGenresintoDB(promise) {

    const genreData = await promise.data.results.map((genre) => {
        return {
            web_id: genre.id,
            name: genre.slug
        }
    })
    // insertar datos con sequelize...
    return Genre.bulkCreate(genreData)

}

// Popula base de datos con juegos(listo) y generos(pendiente)
async function populateDb() {
    /*
    IMPORTANTE: Cambiar sincronización de modelos de
    sequelize para evitar llamar a la api cada vez que
    se reinicia el server
    */
    console.log("### Revisión de datos inicial ###")

    const testQuery = Videogame.findAll()
    testQuery.then(data => {
        if (data.length === 0) {
            // Si no hay dartos en DB, hacer fetch
            console.log("¡Base de datos vacía!")
            console.log("Llamando API...")

            /* 
            recopilamos los 19 generos existentes en la API
            */

            // pedir información de los generos
            infoRequester('https://api.rawg.io/api/genres?page_size=20&key=').then((data) => {
                console.log("### Generos obtenidos exitosamente de API ###")
                insertGenresintoDB(data).then(() => {
                    console.log("### Inserción de generos terminada exitosamente ###")
                }).catch((err)=>{
                    console.log("No se pudo ingresar generos a la BD")
                    console.log(err)
                })
            }).catch((err) => {
                console.log(`No se pudo obtener generos de la API`)
                console.log(err)
            }).then(() => {
                /* 
                recopilamos total de 120 juegos en 3 requests
                
                (piden 100 en
                los requisitos del PI, pero el máximo de
                juegos x request es 40 (tamaño de paginacion),
                asi que para
                */

                // pedir información de los juegos
                let gameRequests = [
                    infoRequester('https://api.rawg.io/api/games?page_size=40&page=1&key='),
                    infoRequester('https://api.rawg.io/api/games?page_size=40&page=2&key='),
                    infoRequester('https://api.rawg.io/api/games?page_size=40&page=3&key=')
                ]

                Promise.all(gameRequests).then(() => {
                    console.log("### Juegos obtenidos exitosamente de API ###")

                    gameRequests = gameRequests.map(insertGamesintoDB)

                    Promise.all(gameRequests).then(() => {
                        console.log("### Inserción de juegos terminada exitosamente ###")
                    }).catch((err) => {
                        console.log("Error, Falló inserción de datos")
                        console.log(err)
                    
                    }).then(() => {
                        /* Insertar Asociaciones a base de datos */
                        insertAssociationsGamesGenres()
                    })


                }).catch((err) => {
                    console.log(`No se pudo obtener juegos de la API`)
                    console.log(err)
                })
            })


        } else {
            console.log("Base ya está populada")
            console.log("### Revisión de datos terminada ###")
        }
    })
}

module.exports = {
    populateDb
}