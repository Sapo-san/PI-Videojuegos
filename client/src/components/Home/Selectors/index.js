import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './selectors.css'

import {
    setPageFiltersGenre,
    setPageFiltersOrigin,
    setPageFiltersOrderBy,
    setPageFiltersOrderDirection,
    loadGenres
} from '../../../redux/actions'

const Selectors = () => {

    //const [availableGenres, setAvailableGenres] = useState(null)
    const availableGenres = useSelector(state => state.genres)
    const filters = useSelector(state => state.filters)
    const dispatcher = useDispatch()

    const listAvaibleGenres = () => {
        let listedAvaibleGenres = availableGenres.map(elem => {
            return (<option value={elem.web_id} key={elem.web_id} >{elem.name}</option>)
        })

        listedAvaibleGenres = [<option value="all" key="all"> Todos </option>].concat(listedAvaibleGenres)

        return listedAvaibleGenres
    }

    if (availableGenres === null) {
        fetch("http://localhost:3001/genres").then(res => {
            res.json().then(data => {
                //setAvailableGenres(data)
                dispatcher(loadGenres(data))
            })
        })
        return (<div className='filterSelectors'>Cargando...</div>)
    }

    return (
    <div className='filterSelectors'>

        <div className='dualSelectors'>
            <div className='singleSelector' >
                <label>Filtrar por género:</label>
                <select value={filters.genre} onChange={ e => {
                    dispatcher(setPageFiltersGenre(e.target.value))
                }}>
                    {listAvaibleGenres()}
                </select>
            </div>
            <div className='singleSelector'>
                <label>Filtrar por origen:</label>
                <select value={filters.origin} onChange={ e => {
                    dispatcher(setPageFiltersOrigin(e.target.value))
                }}>
                    <option value="all" > Todos </option>
                    <option value="RAWG" > RAWG </option>
                    <option value="this" > Esta app </option>
                </select>
            </div>
        </div>
        <div className='dualSelectors'>
            <div className='singleSelector'>
                <label>Ordenar por:</label>
                <select value={filters.orderBy} onChange={ e => {
                    dispatcher(setPageFiltersOrderBy(e.target.value))
                }}>
                    <option value="rat" > Rating </option>
                    <option value="alf" > Alfabético </option>
                </select>
            </div>
            <div className='singleSelector'>
                <label>Orden:</label>
                <select value={filters.orderDirection} onChange={ e => {
                    dispatcher(setPageFiltersOrderDirection(e.target.value))
                }}>
                    <option value="up" > { filters.orderBy === "alf" ? "A-Z" : "Ascendente"} </option>
                    <option value="down" > { filters.orderBy === "alf" ? "Z-A" : "Descendente"} </option>
                </select>
            </div>
        </div>
  
    </div>
    )
}



export default Selectors