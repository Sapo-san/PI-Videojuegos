const customIdsStartAt = 1000000

export function filterGamesByGenre(games, genre) {
    if (genre === "all") {
        return games
    }

    let filtGames = []

    games.forEach(game => {
        if (game.genres.map(gameGenre => {
            return gameGenre.web_id
        }).includes(parseInt(genre))) {
            filtGames.push(game)
        }
    });

    return filtGames
}

export function filterGamesByOrigin(games, origin) {
    if (origin === "all") {
        return games
    }

    let filtGames = []

    games.forEach(element => {
        if (origin === 'RAWG' && element.web_id < customIdsStartAt) {
            filtGames.push(element)
        }

        if (origin === 'this' && element.web_id >= customIdsStartAt) {
            filtGames.push(element)
        }
    });

    return filtGames
}

function compareNames(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}

function compareRatings(a, b) {
    if (parseFloat(a.rating) < parseFloat(b.rating)) return 1;
    if (parseFloat(a.rating) > parseFloat(b.rating)) return -1;
    return 0;
}

export function orderGamesBy(games, orderBy, orderDirection) {
   switch (orderBy) {
    case "alf":
        games.sort(compareNames)
        if (orderDirection === "down") {
            games.reverse()  
        } 
        return games

    case "rat":
        games.sort(compareRatings)
        if (orderDirection === "up") {
            games.reverse()  
        } 
        return games
   
       default:
           return games
   } 
}