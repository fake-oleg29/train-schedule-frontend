import api from '../../services/api';
import type { Ticket } from './ticketTypes';

export interface CreateTicketDto {
  routeId: string;
  fromStopId: string;
  toStopId: string;
  seatNumber: number;
}

export const ticketsAPI = {
  createTicket: async (data: CreateTicketDto): Promise<Ticket> => {
    const response = await api.post<Ticket>(`/tickets`, data);
    return response.data;
  },
  getAllTickets: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>(`/tickets/my`);
    return response.data;
  },
  deleteTicket: async (id: string): Promise<void> => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
};

