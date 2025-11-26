import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
