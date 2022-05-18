import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadGameInfo, setCurrentPage } from '../../redux/actions'
import './home.css'
import GameCard from './GameCard'
import Pagination from './Pagination'

const GAME_REQUEST_URL = "http://localhost:3001/videogames"

const Home = () => {

  const [searchBarValue, setSearchBarValue] = useState('')
  const gamesToDisplay = useSelector( state => state.gameInfo )
  const dispatcher = useDispatch()
  const currentDisplayPage = useSelector( state => state.currentPage)

  function setCurrentDisplayPage(page) {
    dispatcher(setCurrentPage(page))
  }


  function getGamesToDisplay() {
    if (!searchBarValue) {
      fetch(GAME_REQUEST_URL).then(res => res.json().then(
        data => {
          dispatcher(loadGameInfo(data))
        }
      )).catch(err => {
        console.log(err)
        return (<h1>Error 500, ver consola para mas detalles</h1>)
      })
      
    }
  }

  if (!gamesToDisplay) getGamesToDisplay();

  function returnGamesToDiplay(page) {
    if (!gamesToDisplay) {
      return (<h1>Cargando...</h1>)
    }

    // 15 juegos por página
    let games;
    let initialIndex = (page-1)*15
    let finalIndex = (page)*15
    if (finalIndex > gamesToDisplay.length) {
      games = gamesToDisplay.slice(initialIndex, gamesToDisplay.length)
    }
    else {
      games = gamesToDisplay.slice(initialIndex, finalIndex)
    }

    return games.map(game => {
      return <GameCard
                key={game.web_id}
                id={game.web_id}
                name={game.name}
                img={game.background_img}
                genres={game.genres}
             />
    })

  }

  function displayPagination() {
    if (!gamesToDisplay) return null;
    return <Pagination currentPage={currentDisplayPage} totalAmountOfGames={gamesToDisplay.length} pageSet={setCurrentDisplayPage} />
  }
  
  return (<div className="homeContainer">

    <h1>Inicio</h1>

    <h3>Buscador de juegos:</h3>
    <div className='searchBarContainer'>
      <input value={searchBarValue} onChange={(e) => setSearchBarValue(e.target.value.trim())} className='searchBar' type="text" placeholder='Título del juego' ></input>
      <button className='searchButton' onClick={(e) => e.preventDefault()}>Buscar</button>
    </div>

    <div className='displayerContainer'>

      <div className='displayerControls'>Botones de ordenación, filtrado por genero y api/creado</div>

      {displayPagination()}

      <div className='displayer'>
        {returnGamesToDiplay(currentDisplayPage)}
      </div>
      
      {displayPagination()}
      
    </div>


  </div>
    
  )
}

export default Home