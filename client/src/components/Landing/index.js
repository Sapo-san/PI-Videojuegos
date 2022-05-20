import React from 'react'
import { Link } from 'react-router-dom'
import './landingPage.css'

const Landing = () => {
  return (<div className="landingPage">
    <h1>Página Inicial</h1>

    <img
      className='landingImg'
      src="https://c4.wallpaperflare.com/wallpaper/523/83/614/video-games-fan-art-fallout-gears-of-war-wallpaper-preview.jpg"
      alt="Imagen de videojuegos"
    />
    
    <Link className="button" to="home">Ir a Inicio</Link>

    <p>Este Proyecto consume <a href="https://api.rawg.io/docs/">RAWG API</a>.</p>
  </div>
  )
}

export default Landing