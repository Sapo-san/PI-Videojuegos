import React from 'react'
import { useNavigate } from 'react-router-dom'


import './GameCard.css'

const GameCard = ({ name, img, genres, id }) => {

  const navigate = useNavigate()
  console.log(id)

  return (
    <div className='gameCard' onClick={() => navigate("/game/" + id)}>
      <h3 className='gameCardTitle'>{name}</h3>
      <img className='gameCardImg' src={img} alt={name+"-bg-img"}/>
      <div className='cardGenresContainer'>
        {genres.map((genre) => <div className='cardGenre' key={genre.web_id}>{genre.name}</div>)}
      </div>
    </div>
  )
}

export default GameCard