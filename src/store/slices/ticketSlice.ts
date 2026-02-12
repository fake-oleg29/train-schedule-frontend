import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ticketsAPI, type CreateTicketDto } from '../../features/tickets/ticketAPI';
import type { Ticket } from '../../features/tickets/ticketTypes';
import type { AxiosError } from 'axios';

interface TicketState {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  isLoading: false,
  error: null,
};

export const fetchTickets = createAsyncThunk<
  Ticket[],
  void,
  { rejectValue: string }
>('tickets/fetchTickets', async (_, { rejectWithValue }) => {
  try {
    const tickets = await ticketsAPI.getAllTickets();
    return tickets;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to fetch tickets. Please try again.'
    );
  }
});

export const createTicket = createAsyncThunk<
  Ticket,
  CreateTicketDto,
  { rejectValue: string }
>('tickets/createTicket', async (ticketData, { rejectWithValue }) => {
  try {
    const ticket = await ticketsAPI.createTicket(ticketData);
    return ticket;
  } catch (error) {
    console.error('Create ticket error:', error);
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to create ticket. Please try again.'
    );
  }
});

export const returnTicket = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('tickets/returnTicket', async (ticketId, { rejectWithValue }) => {
  try {
    await ticketsAPI.deleteTicket(ticketId);
    return ticketId;
  } catch (error) {
    console.error('Return ticket error:', error);
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to return ticket. Please try again.'
    );
  }
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
        state.isLoading = false;
        state.tickets.push(action.payload);
        state.error = null;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create ticket';
      })
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
        state.isLoading = false;
        state.tickets = action.payload;
        state.error = null;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch tickets';
      })
      .addCase(returnTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(returnTicket.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.tickets = state.tickets.filter((ticket) => ticket.id !== action.payload);
        state.error = null;
      })
      .addCase(returnTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to return ticket';
      })
  },
});

export const { clearError } = ticketSlice.actions;
export default ticketSlice.reducer;