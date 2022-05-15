
const API_KEY = process.env.API_KEY

async function getGameDescription(gameId) {
    gameData = await axios.get("https://api.rawg.io/api/games/" + gameId + "?key=" + API_KEY)
    return gameData.description_raw
}

module.exports = getGameDescription