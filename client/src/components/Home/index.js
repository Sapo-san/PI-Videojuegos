import env from "react-dotenv";
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSearchBarValue, setCurrentPage, loadGameInfo, setPostFilterGames, setExtraSearchButton, resetPageFilters } from '../../redux/actions'
import Displayer from './Displayer'
import Pagination from './Pagination'
import Selectors from './Selectors'
import './home.css'

const GAME_REQUEST_URL = env.BACKEND_URL + "/videogames?name="
const GAME_REQUEST_URL_2 = env.BACKEND_URL + "/videogames"

const Home = () => {

  const searchBarValue = useSelector(state => state.searchBarContent)
  const extraSearch = useSelector(state => state.showExtraSearchButton)
  const gamesPostFilter = useSelector( state => state.gameInfoPostFilters)
  const currentDisplayPage = useSelector(state => state.currentPage)
  const dispatcher = useDispatch()

  function reloadGames() {
    fetch(GAME_REQUEST_URL_2).then(res => res.json().then(
      data => {
        console.log(data)
        dispatcher(loadGameInfo(data))
        dispatcher(resetPageFilters())
        setCurrentDisplayPage(1)
        dispatcher(setPostFilterGames([null,null]))
      }
    )).catch(err => {
      console.log(err)
      return (<h1>Error 500, ver consola para mas detalles</h1>)
    })
  }


  function searchGames(api) {
    if (api) {
      fetch(GAME_REQUEST_URL+searchBarValue+"&api=true").then(
        res => res.json().then(
          data => {
            dispatcher(loadGameInfo(data))
            dispatcher(resetPageFilters())
            setCurrentDisplayPage(1)
            dispatcher(setPostFilterGames([null,null]))
            dispatcher(setExtraSearchButton(false))
          }
        ).catch(err => {
          console.log(err)
          dispatcher(setExtraSearchButton(false))
        })
      ).catch(err => console.log(err))
    } else {
      fetch(GAME_REQUEST_URL+searchBarValue).then(
        res => res.json().then(
          data => {
            dispatcher(resetPageFilters())
            setCurrentDisplayPage(1)
            dispatcher(loadGameInfo(data))
            dispatcher(setPostFilterGames([null,null]))
            dispatcher(setExtraSearchButton(true))
          }
        )
      ).catch(err => {
        console.log(err)
        dispatcher(setExtraSearchButton(false))
      })
    }
  }

  function showExtraSearchButton() {
    if (extraSearch && searchBarValue !== '') {
      return (
        <div>
          <h3>¿No encuentras lo que buscas?</h3>
          <button className='searchButton' onClick={(e) =>{
            e.preventDefault()
            searchGames(true)
          }}>Buscar en RAWG</button>
        </div>
      )
    }
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

      <button className='searchButton' onClick={(e) => {
        e.preventDefault()
        dispatcher(setSearchBarValue(''))
        reloadGames()
      }}
      >Reiniciar</button>
    </div>

    {showExtraSearchButton()}

    <div className='displayerContainer'>

      {displaySelectors()}

      {displayPagination()}

      <Displayer setCurrentPage={setCurrentDisplayPage}/>
      
      {displayPagination()}
      
    </div>
  </div>)
}

export default Home