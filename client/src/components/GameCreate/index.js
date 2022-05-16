import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import './gameCreate.css'

const GameCreate = () => {

  const [formState, setFormState] = useState({
    name: null,
    description: null,
    release_date: null,
    rating: 2.5,
    platforms: null,
    background_image: ""
  })

  return (
    <div className='gameCreateContainer'>

      <h1>Crear Videojuego</h1>

      <div className='formContainer'>
        
        <div className='imgContainer'>
          <p>Vista previa de la imagen:</p>
          <img src={formState.background_image} alt=""/>
        </div>

        <form className='gameCreateform'>
          <div className='inputContainer'>
              <p>Nombre:</p>
              <input
                type="text"
                name="name"
                placeholder='Nombre del juego...'
                onChange={(event) => {setFormState({...formState, name: event.target.value})}}>
              </input>
          </div>
          <div className='inputContainer'>
              <p>Géneros:</p>
              <input
                type="text"
                name="genres"
                placeholder='Esto no funciona todavia xd'>
              </input>
          </div>
          <div className='inputContainer'>
            <p>Descripción:</p>
            <textarea
              name="description"
              rows="10"
              placeholder='Ingresa la descripción aquí...'
              onChange={(event) => {setFormState({...formState, description: event.target.value})}}>
            </textarea>
          </div>
          <div className='inputContainer'>
            <p>Fecha de lanzamiento: {formState.release_date}</p>
            <input
              type="date"
              name="release_date"
              onChange={(event) => {setFormState({...formState, release_date: event.target.value})}}>
            </input>
          </div>
          <div className='inputContainer'>
            <p>Rating: {formState.rating}</p>
            <input
              type="range"
              name="rating"
              min="0" max="5"
              step="0.01"
              value={formState.rating}
              onChange={(event) => {setFormState({...formState, rating: event.target.value})}}>
            </input>
          </div>
          <div className='inputContainer'>
            <p>Plataformas: (ingresar separadas por espacios)</p>
            <input
              type="text"
              name="platforms"
              placeholder='ejemplo: pc xbox-one playstation-4 nintendo-switch'
              onChange={(event) => {setFormState({...formState, platforms: event.target.value})}}>
            </input>
          </div>
          <div className='inputContainer'>
            <p>Link a la imagen del juego</p>
            <input
              type="text"
              name="background_image"
              onChange={(event) => {setFormState({...formState, background_image: event.target.value})}} placeholder='http://link-a/una/imagen.png'>
            </input>
          </div>
          <button className="backLink"> Crear Juego</button>
        </form>
      </div>

      

      <Link className="backLink" to="/home">Volver a Inicio</Link>
    </div>
  )
}

export default GameCreate