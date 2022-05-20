// Action Types
import { 
    LOAD_GAME_INFO,
    RELOAD_GAME_INFO,
    LOAD_GAME_DETAILS,
    SET_CURRENT_PAGE,
    SET_PAGE_FILTERS_GENRE,
    SET_PAGE_FILTERS_ORIGIN,
    SET_PAGE_FILTERS_ORDER_BY,
    SET_PAGE_FILTERS_ORDER_DIRECTION,
    LOAD_GENRES,
    SET_POST_FILTER_GAMES
} from "./actions"

const defaultFilters = {
    genre: "all", // Filtrar por género
    origin: "all", // Filtrar por origen
    orderBy: "rat", // Ordenar por...
    orderDirection: "down" // Tipo de orden... (ascendente, descendente)
}

const initialState = {
    gameInfo: null,
    currentGameDetails: null,
    currentPage: 1,
    filters: defaultFilters,
    lastUsedfilters: defaultFilters,
    gameInfoPostFilters: null,
    genres: null
}

export function gameStore(state = initialState, action) {
    switch (action.type) {
        case LOAD_GAME_INFO:
            return {
                ...state,
                gameInfo: action.payload
            }
        
        case RELOAD_GAME_INFO:
            return {
                ...state,
                gameInfo: action.payload,
                gameInfoPostFilters: null
            }
    
        case LOAD_GAME_DETAILS:
            return {
                ...state,
                currentGameDetails: action.payload
            }
        
        case SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.payload
            }

        case SET_PAGE_FILTERS_GENRE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    genre: action.payload
                }
            }
        
        case SET_PAGE_FILTERS_ORIGIN:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    origin: action.payload
                }
            }
        
        case SET_PAGE_FILTERS_ORDER_BY:
            let orderBy = action.payload
            let orderDirection = "down"

            if (orderBy === "alf") {
                orderDirection = "up"
            }
        
            return {
                ...state,
                filters: {
                    ...state.filters,
                    orderBy: orderBy,
                    orderDirection: orderDirection
                }
            }
        
        case SET_PAGE_FILTERS_ORDER_DIRECTION:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    orderDirection: action.payload
                }
            }

        case LOAD_GENRES:
            return {
                ...state,
                genres: action.payload
            }
        
        case SET_POST_FILTER_GAMES:
            return {
                ...state,
                lastUsedfilters: action.payload[0],
                gameInfoPostFilters: action.payload[1]
            }

        default:
            return state;
    }
}