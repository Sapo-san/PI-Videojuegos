const { Videogame } = require("../db")

const API_KEY = process.env.API_KEY

async function getGameDescription(gameId) {
    gameData = await axios.get("https://api.rawg.io/api/games/" + gameId + "?key=" + API_KEY)
    return gameData.description_raw
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

module.exports = { getGameDescription, generateNewGameID }