import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import './gameCreate.css'

const GAME_CREATE_URL =  'http://localhost:3001/videogame/'

const GameCreate = () => {

  const [formState, setFormState] = useState({
    name: null,
    description: null,
    genres: [],
    release_date: null,
    rating: 2.5,
    platforms: null,
    background_image: ""
  })

  const [formErrors, setFormErrors] = useState({
    name: null,
    description: null,
    genres: null,
    release_date: null,
    rating: null,
    platforms: null,
    background_image: null
  })

  const [availableGenres, setAvailableGenres] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState(['',0]) // el cero es variable de control

  let navigate = useNavigate()

  /** Retorna array de options (para el select) de los generos disponibles */
  const listAvaibleGenres = () => {
    let listedAvaibleGenres = availableGenres.map(elem => {
      if (formState.genres.includes(elem.web_id)) {
        return null
      } else {
        return (<option value={elem.web_id} >{elem.name}</option>)
      }
    }).filter((elem) => {
      if (elem) return true;
      return false
    })

    if (listedAvaibleGenres.length === 0) {
      return <option disabled hidden> - </option>
    }

    let genreToSelect = listedAvaibleGenres[0].props.value.toString()
    if (listedAvaibleGenres.length !== selectedGenre[1] && genreToSelect !== selectedGenre[0]) {
      setSelectedGenre([genreToSelect,listedAvaibleGenres.length])
    }

    return listedAvaibleGenres
  }

  /** Retorna array html de los generos selecionados en el form */
  const listSelectedGenres = () => {
    return availableGenres.map(elem => {
      if (formState.genres.includes(elem.web_id)) {
        return <label className='listedGenre' key={elem.web_id}>{elem.name}<button className='deleteGenrebutton' id={elem.web_id} onClick={(e) => {
          e.preventDefault()
          let newList = formState.genres.filter((elem) => {
            if (elem === parseInt(e.target.id)) return false;
            return true
          })
          setFormState({...formState, genres: newList})
        }}>X</button></label>
      } else {
        return null
      }
    })
  }

  const validateFormAndPostIfOK = () => {

    let foundErrors = {
      ...formErrors
    }
  
    if (!formState.name) {
      foundErrors.name = "El juego debe tener un nombre"
    } else {
      foundErrors.name = null
    }

    if (formState.name && formState.length > 70 ) {
      foundErrors.name = "El nombre del juego no debe tener más de 70 caracteres"
    } 

    if (formState.genres.length === 0) {
      foundErrors.genres = "El juego debe tener al menos un género"
    } else {
      foundErrors.genres = null
    }

    if (!formState.description) {
      foundErrors.description = "El juego debe tener una descripción"
    } else {
      foundErrors.description = null
    }

    if (!formState.release_date) {
      foundErrors.release_date = "El juego debe tener una fecha de lanzamiento"
    } else {
      foundErrors.release_date = null
    }

    if (!formState.platforms) {
      foundErrors.platforms = "El juego debe tener al menos una plataforma"
    } else {
      foundErrors.platforms = null
    }

    if (formState.background_image.length > 255 ) {
      foundErrors.genres = "El link a la imagen del juego no puede tener más de 255 carácteres"
    } else {
      foundErrors.background_image = null
    }

    if (!foundErrors.name && !foundErrors.genres
      && !foundErrors.description && !foundErrors.release_date
      && !foundErrors.platforms && !foundErrors.background_image) {
      //hacer post owo
      console.log("No hay errores wiii")
      
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(formState)
      }

      // validado correctamente, se postea
      fetch(GAME_CREATE_URL, requestOptions)
        .then(response => response.json()
          .then(data => {
            // éxito, redirigir a detalles del juego
            console.log(data)
            navigate("/game/" + data.web_id)
          }))
            // error, mostrar error en pantalla uwu
            .catch(err => console.log(err))
      
    } else {
      setFormErrors(foundErrors)
    }
  } 

  const clearValidation = (whichValidation) => {
    switch (whichValidation) {
      case 'name':
        setFormErrors({...formErrors, name: null})
        return
      case 'genres':
        setFormErrors({...formErrors, genres: null})
        return
      case 'description':
        setFormErrors({...formErrors, description: null})
        return
      case 'release_date':
        setFormErrors({...formErrors, release_date: null})
        return
      case 'platforms':
        setFormErrors({...formErrors, platforms: null})
        return
      case 'background_image':
        setFormErrors({...formErrors, background_image: null})
        return
      
      case 'all':
        setFormErrors({
          name: null,
          description: null,
          genres: null,
          release_date: null,
          rating: null,
          platforms: null,
          background_image: null
        })
        return

      default:
        break;
    }
  }

  /** Retorna html de la selección de generos del form */
  const genreSelector = () => {

    if (availableGenres === null) {
      fetch("http://localhost:3001/genres").then(res => {
        res.json().then(data => {
          setAvailableGenres(data)
        })
      })
      return (<p>Géneros: Cargando...</p>)
    } else {
      return (<>
      <p>Géneros: <i className="warning">{formErrors.genres}</i></p>
      <div className='displayGenreSelectorStuff'>
        <select value={selectedGenre[0]} onChange={(e) => setSelectedGenre([e.target.value,selectedGenre[1]])}>
          {listAvaibleGenres()}
        </select>
        <button className='addGenreButton' onClick={(e) => {
          e.preventDefault()
          if (!formState.genres.includes(parseInt(selectedGenre))) {
            // si NO incluye el genero seleccionado (evitar que se repitan generos en el form)
            setFormState({...formState, genres: [...formState.genres, parseInt(selectedGenre)]})
            clearValidation('genres')
          }
          
        }}>Añadir Género</button>
      </div>
        
    
        <p>Géneros seleccionados:</p>
        <div className='genreList'>
          {listSelectedGenres()}
        </div>
      </>)
    }
  }



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
              <p>Nombre: <i className='warning'>{formErrors.name}</i></p>
              <input
                type="text"
                name="name"
                placeholder='Nombre del juego...'
                onChange={(event) => {
                  setFormState({...formState, name: event.target.value})
                  clearValidation('name')
                  }}>
              </input>
          </div>
          <div className='inputContainer'>
              {genreSelector()}
          </div>
          <div className='inputContainer'>
            <p>Descripción: <i className='warning'>{formErrors.description}</i></p>
            <textarea
              name="description"
              rows="10"
              placeholder='Ingresa la descripción aquí...'
              onChange={(event) => {
                setFormState({...formState, description: event.target.value})
                clearValidation('description')
                }}>
            </textarea>
          </div>
          <div className='inputContainer'>
            <p>Fecha de lanzamiento: {formState.release_date} <i className='warning'>{formErrors.release_date}</i></p>
            <input
              type="date"
              name="release_date"
              onChange={(event) => {
                setFormState({...formState, release_date: event.target.value})
                clearValidation('release_date')
                }}>
            </input>
          </div>
          <div className='inputContainer'>
            <p>Rating: {formState.rating} </p>
            <input
              type="range"
              name="rating"
              min="0" max="5"
              step="0.01"
              value={formState.rating}
              onChange={(event) => {
                setFormState({...formState, rating: event.target.value})
                }}>
            </input>
          </div>
          <div className='inputContainer'>
            <p>Plataformas: (ingresar separadas por espacios) <i className='warning'>{formErrors.platforms}</i></p>
            <input
              type="text"
              name="platforms"
              placeholder='ejemplo: pc xbox-one playstation-4 nintendo-switch'
              onChange={(event) => {
                setFormState({...formState, platforms: event.target.value})
                clearValidation('platforms')
                }}>
            </input>
          </div>
          <div className='inputContainer'>
            <p>Link a la imagen del juego: <i className='warning'>{formErrors.background_image}</i></p>
            <input
              type="text"
              name="background_image"
              onChange={(event) => {
                setFormState({...formState, background_image: event.target.value})
                clearValidation('description')
                }} placeholder='http://link-a/una/imagen.png'>
            </input>
          </div>
          <button onClick={(e) => {
            e.preventDefault()
            clearValidation('all')
            validateFormAndPostIfOK()
            }} className="backLink"> Crear Juego</button>
        </form>
      </div>

      <Link className="backLink" to="/home">Volver a Inicio</Link>
    </div>
  )
}

export default GameCreate