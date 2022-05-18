const { Videogame } = require("../db")
const axios = require("axios")

const API_KEY = process.env.API_KEY

async function getGameDescription(gameId) {
    gameData = await axios.get("https://api.rawg.io/api/games/" + gameId + "?key=" + API_KEY)
    description = gameData.data.description_raw.split('\n')
    return description
}

async function getGameGenres(gameId) {
    
    genres = await game.getGenres()
    
    return genres
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
            background_img: games[index].dataValues.background_image,
            genres: genres
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
            console.log("Waiting for game number:", currentNumber)
            game = await Videogame.findByPk(currentNumber)
            if (game === null) {
                console.log("found ID with no game yet", currentNumber)
                searching = false
            } else {
                console.log("game found:", game)
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



module.exports = { getGameDescription, generateNewGameID, getGamesGenres }