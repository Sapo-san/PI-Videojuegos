import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadGameInfo, setCurrentPage, setPostFilterGames } from '../../redux/actions'
import './home.css'
import GameCard from './GameCard'
import Pagination from './Pagination'
import Selectors from './Selectors'
import { filterGamesByGenre, filterGamesByOrigin, orderGamesBy } from './filterFunctions'


const GAME_REQUEST_URL = "http://localhost:3001/videogames"

const Home = () => {
  /**
   * Lección aprendida: en react, SIEMPRE separar
   * la lógica del componente del renderizado del mismo
   * 
   * A.K.A. no hacer ninguna clase de setState DENTRO del HTML a retornar
   * 
   * Identificar este error:
   * Cannot update a component while rendering a different component warning
   * 
   * */ 

  const [searchBarValue, setSearchBarValue] = useState('')
  const gamesToDisplay = useSelector( state => state.gameInfo )
  const gamesPostFilter = useSelector( state => state.gameInfoPostFilters )
  const filters = useSelector( state => state.filters )
  const lastUsedfilters = useSelector( state => state.lastUsedfilters )
  const dispatcher = useDispatch()
  const currentDisplayPage = useSelector( state => state.currentPage)

  function setCurrentDisplayPage(page) {
    dispatcher(setCurrentPage(page))
  }

  function getGamesToDisplay() {
    if (!searchBarValue) {
      fetch(GAME_REQUEST_URL).then(res => res.json().then(
        data => {
          console.log(data[0])
          dispatcher(loadGameInfo(data))
        }
      )).catch(err => {
        console.log(err)
        return (<h1>Error 500, ver consola para mas detalles</h1>)
      })
      
    }
  }

  if (!gamesToDisplay) getGamesToDisplay();

  useEffect(() => {

    if (gamesToDisplay) {
          let filteredGames = [...gamesToDisplay];

          console.log(filteredGames[0])

          if (gamesPostFilter === null) {
            // filtrar
            filteredGames = filterGamesByGenre(filteredGames, filters.genre)
            filteredGames = filterGamesByOrigin(filteredGames, filters.origin)
            filteredGames = orderGamesBy(filteredGames, filters.orderBy, filters.orderDirection)

            // setear lastUsedFilters y gamesPostFilter
            dispatcher(setPostFilterGames([filters, filteredGames]))

            return null

          } else {
            // revisar si filtros actuales son los mismos que lastUsedFilters
            if (lastUsedfilters.genre !== filters.genre ||
              lastUsedfilters.origin !== filters.origin ||
              lastUsedfilters.orderBy !== filters.orderBy ||
              lastUsedfilters.orderDirection !== filters.orderDirection) {
                // si no lo son, setear gamesPostFilter como null
                dispatcher(setPostFilterGames([lastUsedfilters, null]))
              }

          }
    }
  },[dispatcher, filters, gamesPostFilter, gamesToDisplay, lastUsedfilters])

  function returnGamesToDiplay() {
    if (gamesPostFilter === null) {
      return (<h1>Cargando...</h1>)
    } else {
      // revisar si filtros actuales son los mismos que lastUsedFilters
      if (lastUsedfilters.genre === filters.genre &&
        lastUsedfilters.origin === filters.origin &&
        lastUsedfilters.orderBy === filters.orderBy &&
        lastUsedfilters.orderDirection === filters.orderDirection) {
          return paginatedGames(gamesPostFilter)
        } 

    }
  }

  function paginatedGames(gameList) {
    
    // 15 juegos por página
    let games;
    let initialIndex = (currentDisplayPage-1)*15
    let finalIndex = (currentDisplayPage)*15
    if (finalIndex > gamesPostFilter.length) {
      games = gameList.slice(initialIndex, gamesToDisplay.length)
    }
    else {
      games = gameList.slice(initialIndex, finalIndex)
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

  function displaySelectors() {
    if (!gamesToDisplay) return null;
    return <Selectors/>
  }
  
  return (<div className="homeContainer">

    <h1>Inicio</h1>

    <h3>Buscador de juegos:</h3>
    <div className='searchBarContainer'>
      <input value={searchBarValue} onChange={(e) => setSearchBarValue(e.target.value.trim())} className='searchBar' type="text" placeholder='Título del juego' ></input>
      <button className='searchButton' onClick={(e) => e.preventDefault()}>Buscar</button>
    </div>

    <div className='displayerContainer'>

      {displaySelectors()}

      {displayPagination()}

      <div className='displayer'>
        {returnGamesToDiplay()}
      </div>
      
      {displayPagination()}
      
    </div>


  </div>)
}

export default Home