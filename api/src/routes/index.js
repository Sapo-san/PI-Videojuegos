const { Router } = require('express');
const { Videogame } = require('./../db.js')
const gameProcessor = require("../dataProcessors")
const axios = require("axios")
const API_KEY = process.env.API_KEY
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/videogames", (req, res, next) => {
    /*
        Con y sin query params!
    */
    if (!req.query.name) {
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

    // Buscamos en BD
    Videogame.findByPk(gameId).then((data) => {
        
        if (data !== null) {
            res.json(data.dataValues)
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAA")
            next()
        } else {
            // Si no está en BD, buscar en API
            axios.get("https://api.rawg.io/api/games/" + gameId + "?key=" + API_KEY).then((apires) => {
                console.log(apires.status)

                let gameDetails = gameProcessor(apires.data)

                console.log(">>>>>", gameDetails.description)
                
                Videogame.create(gameDetails).then(() => {
                    console.log("Juego con ID", gameDetails.web_id, "insertado en BD")
                })

                res.json(gameDetails)
                next()

            // Si no esta en API, 404
            }).catch((err) => {
                if (err.request && err.request.res.statusCode === 404) {
                    res.sendStatus(404)
                } else {
                    console.log(err)
                    res.sendStatus(500)
                }
            })
        }
        
        
        
        
    })
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
