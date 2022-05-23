import React from 'react'
import GameCard from '../GameCard'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { filterGamesByGenre, filterGamesByOrigin, orderGamesBy } from '../filterFunctions'
import { setPostFilterGames, loadGameInfo } from '../../../redux/actions'

const GAME_REQUEST_URL = "http://localhost:3001/videogames"

const Displayer = ({ setCurrentPage }) => {
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

    const gamesToDisplay = useSelector( state => state.gameInfo )
    const gamesPostFilter = useSelector( state => state.gameInfoPostFilters )
    const filters = useSelector( state => state.filters )
    const lastUsedfilters = useSelector( state => state.lastUsedfilters )
    //const searchBarValue = useSelector(state => state.searchBarContent)
    const currentDisplayPage = useSelector(state => state.currentPage)
    const dispatcher = useDispatch()

    function getGamesToDisplay() {
        fetch(GAME_REQUEST_URL).then(res => res.json().then(
          data => {
            dispatcher(loadGameInfo(data))
          }
        )).catch(err => {
          console.log(err)
          return (<h1>Error 500, ver consola para mas detalles</h1>)
        })
      }
    
    function returnGamesToDiplay() {
        if (gamesPostFilter === null) {
          return (<h1>Cargando...</h1>)
        } else {
          // revisar si filtros actuales son los mismos que lastUsedFilters
          if (lastUsedfilters.genre === filters.genre &&
            lastUsedfilters.origin === filters.origin &&
            lastUsedfilters.orderBy === filters.orderBy &&
            lastUsedfilters.orderDirection === filters.orderDirection) {
              if ( gamesPostFilter.length <= gamesToDisplay.length ) {
                return paginatedGames(gamesPostFilter)
              } else {
                return (<h1>Cargando...</h1>)
              }
              
            } 
    
        }
    }

    function paginatedGames(gameList) {
    
        // 15 juegos por página
        let games;
        let initialIndex = (currentDisplayPage-1)*15
        let finalIndex = (currentDisplayPage)*15
        if (finalIndex > gameList.length) {
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
                    img={game.background_image}
                    genres={game.genres}
                 />
        })
    }
  
    if (!gamesToDisplay) getGamesToDisplay();

    useEffect(() => {
        if (gamesToDisplay) {
          let filteredGames = [...gamesToDisplay];
          if (gamesPostFilter === null) {
            // filtrar
            filteredGames = filterGamesByGenre(filteredGames, filters.genre)
            filteredGames = filterGamesByOrigin(filteredGames, filters.origin)
            filteredGames = orderGamesBy(filteredGames, filters.orderBy, filters.orderDirection)

            // setear lastUsedFilters y gamesPostFilter
            dispatcher(setPostFilterGames([filters, filteredGames]))

            return null

          } else {
            
            if ((currentDisplayPage !== 1) && (lastUsedfilters.genre !== filters.genre || lastUsedfilters.origin !== filters.origin)) {
              setCurrentPage(1)
            }
            
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
      },[currentDisplayPage, dispatcher, filters, gamesPostFilter, gamesToDisplay, lastUsedfilters, setCurrentPage])
    

    return (
        <div className='displayer'>
            {returnGamesToDiplay()}
        </div>
  )
}

export default Displayer