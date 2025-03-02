import { configureStore } from '@reduxjs/toolkit'
import brownieReducer from './brownies/tasksSlice'
export const store = configureStore({
  reducer: {
    brownie: brownieReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
