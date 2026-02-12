import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import routeReducer from './slices/routeSlice';
import trainReducer from './slices/trainSlice';
import ticketReducer from './slices/ticketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routeReducer,
    trains: trainReducer,
    tickets: ticketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

