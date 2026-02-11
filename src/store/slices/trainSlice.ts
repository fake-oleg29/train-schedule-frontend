import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { trainAPI, type CreateTrainDto, type UpdateTrainDto } from '../../features/trains/trainAPI';
import type { Train } from '../../features/trains/trainTypes';
import type { AxiosError } from 'axios';

interface TrainState {
  trains: Train[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TrainState = {
  trains: [],
  isLoading: false,
  error: null,
};

export const fetchTrains = createAsyncThunk<
  Train[],
  void,
  { rejectValue: string }
>('trains/fetchTrains', async (_, { rejectWithValue }) => {
  try {
    const trains = await trainAPI.getAllTrains();
    return trains;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to fetch trains. Please try again.'
    );
  }
});

export const createTrain = createAsyncThunk<
  Train,
  CreateTrainDto,
  { rejectValue: string }
>('trains/createTrain', async (trainData, { rejectWithValue }) => {
  try {
    const train = await trainAPI.createTrain(trainData);
    return train;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to create train. Please try again.'
    );
  }
});

export const updateTrain = createAsyncThunk<
  Train,
  { id: string; data: UpdateTrainDto },
  { rejectValue: string }
>('trains/updateTrain', async ({ id, data }, { rejectWithValue }) => {
  try {
    const train = await trainAPI.updateTrain(id, data);
    return train;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to update train. Please try again.'
    );
  }
});

export const deleteTrain = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('trains/deleteTrain', async (id, { rejectWithValue }) => {
  try {
    await trainAPI.deleteTrain(id);
    return id;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to delete train. Please try again.'
    );
  }
});

const trainSlice = createSlice({
  name: 'trains',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrains.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrains.fulfilled, (state, action: PayloadAction<Train[]>) => {
        state.isLoading = false;
        state.trains = action.payload;
        state.error = null;
      })
      .addCase(fetchTrains.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch trains';
      })
      .addCase(createTrain.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTrain.fulfilled, (state, action: PayloadAction<Train>) => {
        state.isLoading = false;
        state.trains.push(action.payload);
        state.error = null;
      })
      .addCase(createTrain.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create train';
      })
      .addCase(updateTrain.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTrain.fulfilled, (state, action: PayloadAction<Train>) => {
        state.isLoading = false;
        const index = state.trains.findIndex((train) => train.id === action.payload.id);
        if (index !== -1) {
          state.trains[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTrain.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update train';
      })
      .addCase(deleteTrain.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTrain.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.trains = state.trains.filter((train) => train.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTrain.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete train';
      });
  },
});

export const { clearError } = trainSlice.actions;
export default trainSlice.reducer;

