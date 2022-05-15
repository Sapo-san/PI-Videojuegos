import React from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { loadGameDetails } from '../../redux/actions.js' 

const GAME_DETAILS_URL =  'http://localhost:3001/videogames/'

const GameDetails = ({ gameDetails, dispatch }) => {
    const { id } = useParams()

    if (gameDetails === null) {
        fetch(GAME_DETAILS_URL + id).then((res, err) => {
            if (!err) {
                res.json().then((data) => {
                    console.log(data.description)
                    dispatch(loadGameDetails(data))
                })
            }
        })
    }

    console.log("GD", gameDetails)

    if (!gameDetails) {
        return (<>
            <div>Cargando...</div>
            <Link to="/home">Back to Home</Link>
        </>
        )
    } else {
        return (<>
        {gameDetails.name}
        {gameDetails.description}
        <img src={gameDetails.background_image} alt="background"></img>
        {gameDetails.platforms}


        <Link to="/home">Back to Home</Link>
        </>)
    }

    
}


function mapStateToProps(state) {
    return { gameDetails: state.currentGameDetails }
}

export default connect(mapStateToProps)(GameDetails)