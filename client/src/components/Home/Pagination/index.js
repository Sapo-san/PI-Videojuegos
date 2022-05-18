import React from 'react'
import './pagination.css'

const Pagination = ({ currentPage, totalAmountOfGames, pageSet }) => {

    function setPage(event, amount) {
        event.preventDefault()
        pageSet(currentPage + amount)
    }

    const currentPageButton = <button className='current button' onClick={(e) => setPage(e, 0) }>
        {"  "+currentPage+"  "}
    </button>

    const nextPageButton = <button className='next button' onClick={(e) => setPage(e, 1) }>
        {"  >  "}
    </button>

    const previousPageButton = <button className='previous button' onClick={(e) => setPage(e, -1) }>
        {"  <  "}
    </button>
  
    function displayButton(which) {
        switch (which) {
            case 'prev':
                if (currentPage > 1) {
                    return previousPageButton
                }
                break

            case 'next':
                if (currentPage < (totalAmountOfGames / 15 )) {
                    return nextPageButton
                }
                break
    
                default:
                    return currentPageButton
        }
    }

    return (
    <div className='paginationContainer'>
        {displayButton('prev')}
        {displayButton()}
        {displayButton('next')}
    </div>
  )
}

export default Pagination