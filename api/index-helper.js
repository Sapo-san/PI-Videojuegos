const { conn } = require('./src/db.js');
const axios = require("axios")

// Constantes para HTTP requests
const { API_KEY } = process.env;
const GAMES_URL = 'https://api.rawg.io/api/games?page_size=40&page='
const GENRE_URL = 'https://api.rawg.io/api/genres?page_size=20&key='

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

async function insertAssociationsGamesGenres() {
    // Agregar asociaciones a cada juego
    for (let i = 0; i < gameList.length; i++) {
        let game = await Videogame.findByPk(gameList[i].web_id)
        game.addGenres(gameList[i].genres)
    }
    return Promise.resolve()
}

async function insertGamesintoDB(promise) {
    const resolvedPromise = await promise
    const gameData = resolvedPromise.data.results.map(gameProcessor)
    gameList = gameList.concat(gameData)
    // insertar datos con sequelize...    
    return Videogame.bulkCreate(gameData)
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

    ver index.js --> const connConfig
    */
    console.log("--- Revisión de datos inicial ---")

    const testQuery = Videogame.findAll()
    testQuery.then(data => {
        if (data.length === 0) {
            console.log("> ¡Base de datos vacía!")
            console.log("> Llamando API...")

            /* ------------- Recopilamos los 19 generos existentes en la API ------------ */
            axios.get(GENRE_URL + API_KEY).then((data) => {
                console.log(">> Generos obtenidos exitosamente de API <<")
                
                insertGenresintoDB(data).then(() => {
                    console.log("> Inserción de generos terminada exitosamente")
                }).catch((err)=>{
                    console.log("> No se pudo ingresar generos a la BD")
                    console.log(err)
                })
            }).catch((err) => {
                console.log('> No se pudo obtener generos de la API')
                console.log(err)
            
            }).then(() => { 
                /*  ------------- Recopilamos total de 120 juegos en 3 requests  ------------- */

                let gameRequests = [
                    axios.get(GAMES_URL + '1' + '&key=' + API_KEY),
                    axios.get(GAMES_URL + '2' + '&key=' + API_KEY),
                    axios.get(GAMES_URL + '3' + '&key=' + API_KEY)
                ]

                // Esperamos a que terminen las 3 requests
                Promise.all(gameRequests).then(() => {
                    console.log(">> Juegos obtenidos exitosamente de API <<")
                    
                    // insertamos datos de cada request en DB
                    gameRequests = gameRequests.map(insertGamesintoDB)

                    // Esperamos a que termine la inserción de las 3 querys
                    Promise.all(gameRequests).then(() => {
                        console.log("> Inserción de juegos terminada exitosamente")
                    }).catch((err) => {
                        console.log("> Error, Falló inserción de datos")
                        console.log(err)
                    
                    }).then(() => {
                        /* ------------- Insertar Asociaciones a base de datos ------------- */
                        insertAssociationsGamesGenres().then(() => {
                            console.log("> Inserción de asociaciones terminada")
                            console.log("--- Revisión de datos terminada ---")
                        })
                    })


                }).catch((err) => {
                    console.log(`> No se pudo obtener juegos de la API`)
                    console.log(err)
                })
            })

        } else {
            console.log("> Base ya está populada")
            console.log("--- Revisión de datos terminada ---")
        }
    })
}

module.exports = {
    populateDb
}