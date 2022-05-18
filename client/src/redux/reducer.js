// Action Types
import { 
    LOAD_GAME_INFO,
    LOAD_GAME_DETAILS,
    SET_CURRENT_PAGE
} from "./actions"

const initialState = {
    gameInfo: null,
    currentGameDetails: null,
    currentPage: 1
}

export function gameStore(state = initialState, action) {
    switch (action.type) {
        case LOAD_GAME_INFO:
            return {
                ...state,
                gameInfo: action.payload
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


        default:
            return state;
    }
}