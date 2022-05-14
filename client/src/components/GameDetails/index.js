import React from 'react'
import { Link, useParams } from 'react-router-dom'

const GameDetails = () => {
    const { id } = useParams()
    return (<>
        <div>GameDetails: {id}</div>
        <Link to="/home">Back to Home</Link>
    </>
        
    )
}

export default GameDetails