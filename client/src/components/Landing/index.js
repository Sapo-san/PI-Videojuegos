import React from 'react'
import { Link } from 'react-router-dom'
import './landingPage.css'

const Landing = () => {
  return (<div>
    
    <div className="landingImg" ></div>

    <div className='landingPage'>
      <h1>Proyecto individual de Cristóbal Herreros</h1>
      <h1>Tema: Videojuegos</h1>
      <Link className="button" to="home">Ir a Inicio</Link>
      <p>Este Proyecto consume <a href="https://api.rawg.io/docs/">RAWG API</a>.</p>
      <p>Puedes revisar mis otros proyectos en mi Github: <a href="https://github.com/Sapo-san">@Sapo-san</a></p>
    </div>
    
    
  </div>
  )
}

export default Landing
