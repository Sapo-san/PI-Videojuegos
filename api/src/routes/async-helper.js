const { Videogame } = require("../db")
const axios = require("axios")

const API_KEY = process.env.API_KEY

async function getGameDescription(gameId) {
    gameData = await axios.get("https://api.rawg.io/api/games/" + gameId + "?key=" + API_KEY)
    description = gameData.data.description_raw.split('\n')
    return description
}

async function getGamesGenres(Videogame, games) {
    var gameList = []

    for (let index = 0; index < games.length; index++) {
        let game = await Videogame.findByPk(games[index].dataValues.web_id)
        genres = await game.getGenres()
        genres = genres.map(elem => {
            return { name: elem.dataValues.name, web_id: elem.dataValues.web_id }
        })

        gameList.push({
            web_id: games[index].dataValues.web_id,
            name: games[index].dataValues.name,
            background_image: games[index].dataValues.background_image,
            genres: genres,
            rating: games[index].dataValues.rating
        })
    }

    return gameList

}

async function* generateNewGameID() {
    /** Genero un ID a partir del numero 1000000, ya que de ese valor en adelante,
     * la API de RAWG parece quedarse sin juegos. 
     * 
     * Numero modificable en el futuro
     */
    
    // numero inicial (tentativo)
    let currentNumber = 1000000

    // revisamos id creado x nosotros mas grande ya existente en bd
    let searching = true
    while (searching) {
        try {
            game = await Videogame.findByPk(currentNumber)
            if (game === null) {
                searching = false
            } else {
                currentNumber += 1
            }
        } catch (err) {
            console.log("Error while trying to generate ID:", err)
        }
    }
    
    // luego de encontrarlo, retornamos IDs nuevos a partir de ese numero
    while(true) {
        yield currentNumber
        currentNumber++
    }
}

const validatePostRequest = (req) => {

    let foundErrors = {}

    if (Object.keys(req.body).length === 0) {
        return "No body found"
    }
  
    if (!req.body.name) {
      foundErrors.name = "El juego debe tener un nombre"
    }

    if (req.body.name && req.body.name.length > 70 ) {
      foundErrors.name = "El nombre del juego no debe tener más de 70 caracteres"
    } 

    if (!req.body.genres || (Array.isArray(req.body.genres) && req.body.genres.length === 0)) {
      foundErrors.genres = "El juego debe tener al menos un género"
    }

    if (!req.body.description) {
      foundErrors.description = "El juego debe tener una descripción"
    }

    if (!req.body.release_date) {
      foundErrors.release_date = "El juego debe tener una fecha de lanzamiento"
    } 

    if (!req.body.platforms) {
      foundErrors.platforms = "El juego debe tener al menos una plataforma"
    } 
    
    if (req.body.background_image && req.body.background_image.length > 255 ) {
      foundErrors.background_image = "El link a la imagen del juego no puede tener más de 255 carácteres"
    }

    if (!req.body.rating || (req.body.rating < 0 && req.body.rating > 5)) {
      foundErrors.rating = "El juego debe tener un rating (valor flotante entre 0 y 5)"
    }

    if (!foundErrors.name && !foundErrors.genres
      && !foundErrors.description && !foundErrors.release_date
      && !foundErrors.platforms && !foundErrors.background_image
      && !foundErrors.rating) {
        return null      
    }

    

  return foundErrors
}

module.exports = { getGameDescription, generateNewGameID, getGamesGenres, validatePostRequest }