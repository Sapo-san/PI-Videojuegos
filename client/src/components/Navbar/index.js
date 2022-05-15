import React, { useState, useEffect } from 'react'
import { useLocation, NavLink, useNavigate } from 'react-router-dom'
import './navbar.css'


const Navbar = () => {
    
    const location =  useLocation(); 
    const [currentPath, setCurrentPath] = useState(window.location.pathname)
    const navigate = useNavigate()

    useEffect(()=>{ 
        setCurrentPath(location.pathname)
    },[location])

    // no mostrar navbar en landing page
    if (currentPath === "/"){
        return (<div className="hidden">This text should not be seen</div>)
    }
  
    // en cualquier otra ruta...
    return (
        <div className="navbar-container">
            <div className='navlink-container' onClick={() => navigate("/home")}>
                <NavLink className="navlink" to="/home">Inicio</NavLink>
            </div>
            <div className='navlink-container' onClick={() => navigate("/create-new-game")}>
                <NavLink className="navlink" to="/create-new-game">Crear Juego</NavLink>
            </div>
        </div>
    )
}

export default Navbar;