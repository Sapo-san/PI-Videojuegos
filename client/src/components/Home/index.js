import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSearchBarValue, setCurrentPage, loadGameInfo, setPostFilterGames } from '../../redux/actions'
import Displayer from './Displayer'
import Pagination from './Pagination'
import Selectors from './Selectors'
import './home.css'

const GAME_REQUEST_URL = "http://localhost:3001/videogames?name="

const Home = () => {

  const searchBarValue = useSelector(state => state.searchBarContent)
  const gamesPostFilter = useSelector( state => state.gameInfoPostFilters)
  const currentDisplayPage = useSelector(state => state.currentPage)
  const dispatcher = useDispatch()

  function searchGames() {
    fetch(GAME_REQUEST_URL+searchBarValue).then(
      res => res.json().then(
        data => {
          console.log(data)
          dispatcher(loadGameInfo(data))
          dispatcher(setPostFilterGames([{
            genre: "all", // Filtrar por género
            origin: "all", // Filtrar por origen
            orderBy: "rat", // Ordenar por...
            orderDirection: "down" // Tipo de orden... (ascendente, descendente)
        },null]))
          setCurrentPage(1)
        }
      )
    ).catch(err => console.log(err))
  }

  function setCurrentDisplayPage(page) {
    dispatcher(setCurrentPage(page))
  }

  function displayPagination() {
    if (!gamesPostFilter) return null;
    return <Pagination currentPage={currentDisplayPage} totalAmountOfGames={gamesPostFilter.length} pageSet={setCurrentDisplayPage} />
  }

  function displaySelectors() {
    if (!gamesPostFilter) return null;
    return <Selectors/>
  }
  
  return (<div className="homeContainer">

    <h1>Inicio</h1>

    <h3>Buscador de juegos:</h3>
    <div className='searchBarContainer'>
      <input value={searchBarValue} onChange={(e) => dispatcher(setSearchBarValue(e.target.value))} className='searchBar' type="text" placeholder='Título del juego' ></input>
      <button className='searchButton' onClick={(e) =>{
        e.preventDefault()
        searchGames()
      }}>Buscar</button>
    </div>

    <div className='displayerContainer'>

      {displaySelectors()}

      {displayPagination()}

      <Displayer setCurrentPage={setCurrentDisplayPage}/>
      
      {displayPagination()}
      
    </div>
  </div>)
}

export default Home