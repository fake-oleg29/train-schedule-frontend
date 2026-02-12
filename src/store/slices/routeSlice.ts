import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { routeAPI, type CreateRouteWithStopsDto } from '../../features/routes/routeAPI';
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

export const fetchAllRoutes = createAsyncThunk<
  Route[],
  void,
  { rejectValue: string }
>('routes/fetchAllRoutes', async (_, { rejectWithValue }) => {
  try {
    const routes = await routeAPI.getAllRoutesAdmin();
    return routes;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to fetch routes. Please try again.'
    );
  }
});

export const createRoute = createAsyncThunk<
  Route,
  CreateRouteWithStopsDto,
  { rejectValue: string }
>('routes/createRoute', async (routeData, { rejectWithValue }) => {
  try {
    const route = await routeAPI.createRoute(routeData);
    return route;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to create route. Please try again.'
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
      .addCase(searchRoutes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.routes = action.payload;
        state.error = null;
        if (action.meta.arg) {
          state.lastSearch = action.meta.arg;
        }
      })
      .addCase(searchRoutes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error searching for routes';
        state.routes = [];
      })
      .addCase(fetchAllRoutes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllRoutes.fulfilled, (state, action: PayloadAction<Route[]>) => {
        state.isLoading = false;
        state.routes = action.payload;
        state.error = null;
        state.lastSearch = null;
      })
      .addCase(fetchAllRoutes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch routes';
        state.routes = [];
      })
      .addCase(createRoute.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRoute.fulfilled, (state, action: PayloadAction<Route>) => {
        state.isLoading = false;
        state.routes.push(action.payload);
        state.error = null;
      })
      .addCase(createRoute.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create route';
      });
  },
});

export const { clearError, clearRoutes } = routeSlice.actions;
export default routeSlice.reducer;

