const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/videogames", (req, res, next) => {
    /*
        Con y sin query params!
    */
    if (!req.query) {
        // sin query
        console.log("no hay query params")
        res.status(200).send("<h1>Videogames</h1>")
        next()
    } else {
        // con query 
        const keyword = req.query.name

        console.log("hay query params")
        res.status(200).send(`<h1>Searching games with keyword: ${keyword}</h1>`)
        next()
    }
})

router.get("/videogames/:gameid", (req, res, next) => {
    const gameId = req.params.gameid
    res.status(200).send(`<h1>game ID: ${gameId} </h1>`)
    next()
})

router.get("/genres", (req, res, next) => {
    res.status(200).send("<h1>Genres</h1>")
    next()
})

router.post("/videogame", (req, res, next) => {
    res.status(200).send("<h1>posted to create Game</h1>")
    next()
})

module.exports = router;
