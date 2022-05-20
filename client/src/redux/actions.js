// ACTION TYPES
export const LOAD_GAME_INFO = 'LOAD_GAME_INFO'
export const RELOAD_GAME_INFO = 'RELOAD_GAME_INFO'
export const LOAD_GAME_DETAILS = 'LOAD_GAME_DETAILS'
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'
export const SET_PAGE_FILTERS_GENRE = 'SET_PAGE_FILTERS_GENRE'
export const SET_PAGE_FILTERS_ORIGIN = 'SET_PAGE_FILTERS_ORIGIN'
export const SET_PAGE_FILTERS_ORDER_BY = 'SET_PAGE_FILTERS_ORDER_BY'
export const SET_PAGE_FILTERS_ORDER_DIRECTION = 'SET_PAGE_FILTERS_ORDER_DIRECTION'
export const LOAD_GENRES = 'LOAD_GENRES'
export const SET_POST_FILTER_GAMES = 'SET_POST_FILTER_GAMES'

// ACTION CREATORS
export function loadGameInfo(data) {
    return {
        type: LOAD_GAME_INFO,
        payload: data
    }
}

export function reLoadGameInfo(data) {
    return {
        type: RELOAD_GAME_INFO,
        payload: data
    }
}


export function loadGameDetails(data) {
    return {
        type: LOAD_GAME_DETAILS,
        payload: data
    }
}

export function setCurrentPage(data) {
    return {
        type: SET_CURRENT_PAGE,
        payload: data
    }
}

export function setPageFiltersGenre(data) {
    return {
        type: SET_PAGE_FILTERS_GENRE,
        payload: data
    }
}

export function setPageFiltersOrigin(data) {
    return {
        type: SET_PAGE_FILTERS_ORIGIN,
        payload: data
    }
}

export function setPageFiltersOrderBy(data) {
    return {
        type: SET_PAGE_FILTERS_ORDER_BY,
        payload: data
    }
}

export function setPageFiltersOrderDirection(data) {
    return {
        type: SET_PAGE_FILTERS_ORDER_DIRECTION,
        payload: data
    }
}

export function loadGenres(data) {
    return {
        type: LOAD_GENRES,
        payload: data
    }
}

export function setPostFilterGames(data) {
    return {
        type: SET_POST_FILTER_GAMES,
        payload: data
    }
}