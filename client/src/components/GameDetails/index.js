import React from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { loadGameDetails } from '../../redux/actions.js'
import './gameDetails.css'

const GAME_DETAILS_URL =  'http://localhost:3001/videogames/'

const GameDetails = ({ gameDetails, dispatch }) => {
    const { id } = useParams()
    const [content, setContent] = useState((<><h2>Cargando...</h2><Link className='backLink' to="/home">Volver a Inicio</Link></>))
    const [askedForData,setAskedForData] = useState(false)
    const [finallyRendered,setFinallyRendered] = useState(false)


    if (gameDetails === null && !askedForData) {
        setAskedForData(true)
        fetch(GAME_DETAILS_URL + id).then((res, err) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    console.log(data)
                    dispatch(loadGameDetails(data))
                })
            } else {
                if (res.status === 404) {
                    setContent(<>
                        <h2>Juego no encontrado.</h2>
                        <Link className="backLink" to="/home">Volver a Inicio</Link>
                    </>)
                } else {
                    setContent(<>
                        <h2>Servidor responde con código {res.status}: {res.statusText}</h2>
                        <Link className="backLink" to="/home">Volver a Inicio</Link>
                    </>)
                }
            }
        })
    }

    if (gameDetails && !finallyRendered) {
        
        if (gameDetails.release_date !== null) {
            gameDetails.release_date = gameDetails.release_date.slice(0,10)
        } else {
            gameDetails.release_date = "?"
        }
        
        setContent(<div className='gameDetailsContainer'>
        <h1 className='gameTitle'>{gameDetails.name}</h1>
        
        <div className='gameimgAndinfo'>
        <img src={gameDetails.background_image} alt="Portada" className='gameImg'></img>
            <div className='gameInfo' >

                <p><b>Géneros:</b> {gameDetails.genres}</p>
                <p><b>Disponible en:</b> {gameDetails.platforms}</p>
                <div className='gameDescription'>
                    {gameDetails.description.map((elem, index) => {
                        if (index === 0) {
                            return (<p><b>Descripción [EN]:</b> {elem}</p>)
                        } else {
                            return (<p>{elem}</p>)
                        }
                    } )}
                </div>
                <p><b>Rating:</b> {gameDetails.rating} / 5</p>
                
                <p><b>Fecha de lanzamiento:</b> {gameDetails.release_date}</p>
            </div>            
        </div>
        
        <Link className="backLink" to="/home">Volver a Inicio</Link>
        </div>)
        setFinallyRendered(true)
    }

    return content
}

// en este componente usamos MapState, para mostrar como se usa jeje
function mapStateToProps(state) {
    return { gameDetails: state.currentGameDetails }
}

export default connect(mapStateToProps)(GameDetails)