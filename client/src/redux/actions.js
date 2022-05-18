// ACTION TYPES
export const LOAD_GAME_INFO = 'LOAD_GAME_INFO'
export const LOAD_GAME_DETAILS = 'LOAD_GAME_DETAILS'
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'

// ACTION CREATORS
export function loadGameInfo(data) {
    return {
        type: LOAD_GAME_INFO,
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