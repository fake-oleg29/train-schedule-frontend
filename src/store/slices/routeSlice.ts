import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { routeAPI } from '../../features/routes/routeAPI';
import type { Route, SearchRoute } from '../../features/routes/routeTypes';
import type { AxiosError } from 'axios';

interface RouteState {
  routes: Route[];
  isLoading: boolean;
  error: string | null;
  lastSearch: SearchRoute | null;
}

const initialState: RouteState = {
  routes: [],
  isLoading: false,
  error: null,
  lastSearch: null,
};

export const searchRoutes = createAsyncThunk<
  Route[],
  SearchRoute,
  { rejectValue: string }
>('routes/searchRoutes', async (searchParams, { rejectWithValue }) => {
  try {
    const routes = await routeAPI.getAllRoutes(searchParams);
    return routes;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Error searching for routes. Please try again.'
    );
  }
});

const routeSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRoutes: (state) => {
      state.routes = [];
      state.lastSearch = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRoutes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchRoutes.fulfilled, (state, action: PayloadAction<Route[]>) => {
        state.isLoading = false;
        state.routes = action.payload;
        state.error = null;
      })
      .addCase(searchRoutes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error searching for routes';
        state.routes = [];
      });
  },
});

export const { clearError, clearRoutes } = routeSlice.actions;
export default routeSlice.reducer;

