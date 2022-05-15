// Action Types
import { 
    LOAD_GAME_INFO,
    LOAD_GAME_DETAILS
} from "./actions"

const initialState = {
    gameInfo: null,
    currentGameDetails: null
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


        default:
            return state;
    }
}