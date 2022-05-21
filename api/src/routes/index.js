const { Router } = require('express');
const { Videogame, Genre } = require('./../db.js')
const gameProcessor = require('../dataProcessors')
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op
const {
        getGameDescription,
        generateNewGameID,
        getGamesGenres
      } = require('./async-helper')

const axios = require("axios");
const e = require('express');
const API_KEY = process.env.API_KEY
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

var idGenerator = generateNewGameID()

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/videogames", (req, res, next) => {

    if (!req.query.name) {
        // sin query
        Videogame.findAll({
            attributes: ['web_id', 'name', 'background_image', 'rating']
        }).then(
            games => {
                getGamesGenres(Videogame, games).then(
                    gamesList => {
                        res.json(gamesList)
                        next()
                    }
                )
            }
        ).catch(err => {
            console.log(err)
            res.sendStatus(500)
            next()
        })
    } else {
        // con query 
        const name = req.query.name
        const api = req.query.api

        if (api === "true") {
            // Con buscar en API
            axios.get("https://api.rawg.io/api/games?search=" + name + "&key=" + API_KEY).then(
                apires => {
                    if (apires.data.results.length === 0) {
                        res.sendStatus(404)
                        next()
                    } else {
                        let results = apires.data.results.map(elem => {
                            return gameProcessor(elem)
                        })

                        res.json(results)
                        next()
                    }
                }
            )
            
            

            


        } else {
            // Sin buscar en API
            Videogame.findAll({ where: {
                name: {
                    [Op.iLike]: "%" + name + "%"
                }
            }}).then(games => {
                getGamesGenres(Videogame, games).then(gameList => {
                    res.send(gameList)
                    next()
                })
            })
        }

        /* //res.json({ msg: "OK", keyword: keyword})
        axios.get("https://api.rawg.io/api/games?search=" + keyword + "&key=" + API_KEY).then(
            apires => {
                    console.log(apires.data.results)
                    res.sendStatus(200)
                    next()
                }
        ).catch(err => {
            console.log("Error: ", err)
            res.sendStatus(500)
            next()
        }) */


    }
})

router.get("/videogames/:gameid", (req, res, next) => {
    const gameId = req.params.gameid

    Videogame.findByPk(gameId).then((game) => {
        // si esta en BD
        if (game !== null) {

            let gameToSend = { ...game.dataValues } 
            // revisar si tiene descripción
            if (game.description !== null) {
                gameToSend.description = game.description.split("\n")
                game.getGenres().then(genres => {
                    gameToSend.genres = genres.map(elem => elem.dataValues.name).join(' ')
                    res.json(gameToSend)
                    next()
                })
            } else {
                getGameDescription(gameId).then(descr => {
                    gameToSend.description = descr
                    game.getGenres().then(genres => {
                        gameToSend.genres = genres.map(elem => elem.dataValues.name).join(' ')
                        res.json(gameToSend)
                        next()
                    })
                })
            }

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

    idGenerator.next().then(data => {
        let gameInfo = {
            ...req.body,
            web_id: data.value
        }

        gameInfo.name = gameInfo.name.trim().charAt(0).toUpperCase() + gameInfo.name.trim().slice(1);

        Videogame.create(gameInfo).then(game => {
            game.addGenres(req.body.genres).then(() => {
                res.json({ msg: "success", web_id: game.web_id })
                next()
            })
        }).catch(err => {
            console.log("Error while Attempting to Create:", err)
            res.sendStatus(500)
            next()
        })

    })

    
})

module.exports = router;
