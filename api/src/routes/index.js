const { Router } = require('express');
const { Videogame, Genre } = require('./../db.js')
const gameProcessor = require('../dataProcessors')
const getGameDescription = require('./async-helper')
const generateNewGameID = require('./sync-helper')
const axios = require("axios");
const API_KEY = process.env.API_KEY
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

var idGenerator = generateNewGameID()

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/videogames", (req, res, next) => {
    /*
        Con y sin query params!
    */
    if (!req.query.name) {
        // sin query
        res.status(200).send("<h1>Videogames</h1>")
        next()
    } else {
        // con query 
        const keyword = req.query.name

        res.status(200).send(`<h1>Searching games with keyword: ${keyword}</h1>`)
        next()
    }
})

router.get("/videogames/:gameid", (req, res, next) => {
    const gameId = req.params.gameid

    Videogame.findByPk(gameId).then((game) => {
        // si esta en BD
        if (game !== null) {

            // revisar si tiene descripción
            if (game.description !== null) {
                game.description = game.description.split("\n")
            } else {
                game.description = getGameDescription(gameId).split("\n")
            }

            game.getGenres().then(genres => {
                game.dataValues.genres = genres.map(elem => elem.dataValues.name).join(' ')
                
                res.json(game)
                next()
            })

        // si no esta en BD
        } else {
            // Si no está en BD, buscar en API
            axios.get("https://api.rawg.io/api/games/" + gameId + "?key=" + API_KEY).then((apires) => {

                let gameDetails = gameProcessor(apires.data)
                
                Videogame.create(gameDetails).then((game) => {
                    console.log("Juego con ID", game.web_id, "insertado en BD")

                    // insertar generos del juego en BD
                    game.addGenres(gameDetails.genres)

                    Genre.findAll().then(genres => {
                        gameDetails.genres = genres.filter(elem => {
                            if (gameDetails.genres.includes(elem.web_id)) return true;
                            return false
                        }).map((elem) => {
                            return elem.name
                        }).join(' ')

                        // enviar desc como array para ponerla mas bonita en el front
                        gameDetails.description = gameDetails.description.split("\n")

                        res.json(gameDetails)
                        next()

                    })
                })
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
    }).catch(err => {
        res.sendStatus(500)
        console.log(err)
        next()
    })




})

router.get("/genres", (req, res, next) => {
    
    Genre.findAll().then(data => {
        res.json(data.map(elem => {
            return {
                web_id: elem.dataValues.web_id,
                name: elem.dataValues.name
            }
        }))
        next()
    }).catch(err => {
        console.log(err)
        res.sendStatus(500)
        next()
    })
})

router.post("/videogame", (req, res, next) => {
    console.log(req.body)

    let gameInfo = {
        ...req.body,
        web_id: idGenerator.next().value
    }

    Videogame.create(gameInfo).then(game => {
        game.addGenres(req.body.genres).then(() => {
            res.json({ msg: "success", web_id: game.web_id })
            next()
        })
    }).catch(err => {
        console.log(err)
        res.sendStatus(500)
        next()
    })
})

module.exports = router;
