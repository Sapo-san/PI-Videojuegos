function* generateNewGameID() {
    /** Genero un ID a partir del numero 1000000, ya que de ese valor en adelante,
     * la API de RAWG parece quedarse sin juegos. 
     * 
     * Numero modificable en el futuro
     */
    currentNumer = 1000000
    while(true) {
        yield currentNumer
        currentNumer++
    }
}

module.exports = generateNewGameID