// procesador de atributo de juego particular 
function atributeProcessor(pfArray, attribute) {
    let strArray = []
    
    if (pfArray === null) return []

    for (let index = 0; index < pfArray.length; index++) {
        switch (attribute) {
            case "platforms":
                strArray.push(pfArray[index]["platform"]["slug"])
                break;
            case "genres":
                strArray.push(pfArray[index]["id"])
                break;
            default:
                break;
        }
      
    }
    return strArray
};

// procesa la info de un juego y devuelve Obj para ingresar a BD
function gameProcessor(game) {
    // si se modifica esta función, modificar tambien
    // el modelo 
    return {
        web_id: game.id,
        name: game.name,
        description: game.description_raw, 
        release_date: game.released, 
        background_image: game.background_image,
        rating: game.rating,
        platforms: atributeProcessor(game.platforms, "platforms").join(" "),
        genres: atributeProcessor(game.genres, "genres")
    }
};

module.exports = gameProcessor