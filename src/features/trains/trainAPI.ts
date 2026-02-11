import api from '../../services/api';
import type { Train } from './trainTypes';

export interface CreateTrainDto {
  trainNumber: string;
  totalSeats: number;
}

export interface UpdateTrainDto {
  trainNumber?: string;
  totalSeats?: number;
}

export const trainAPI = {
  getAllTrains: async (): Promise<Train[]> => {
    const response = await api.get<Train[]>(`/trains`);
    return response.data;
  },
  createTrain: async (data: CreateTrainDto): Promise<Train> => {
    const response = await api.post<Train>(`/trains`, data);
    return response.data;
  },
  updateTrain: async (id: string, data: UpdateTrainDto): Promise<Train> => {
    const response = await api.patch<Train>(`/trains/${id}`, data);
    return response.data;
  },
  deleteTrain: async (id: string): Promise<void> => {
    await api.delete(`/trains/${id}`);
  },
};

