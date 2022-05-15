import { configureStore } from '@reduxjs/toolkit'

import { gameStore } from './reducer'

const store = configureStore({ reducer: gameStore })

export default store;