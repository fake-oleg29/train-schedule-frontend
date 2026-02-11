import api from '../../services/api';
import type { Route, SearchRoute } from './routeTypes';

export interface CreateRouteDto {
  trainId: string;
  departureDateTime: string;
}

export interface CreateStopDto {
  stationName: string;
  arrivalDateTime: string;
  departureDateTime: string;
  stopNumber: number;
  priceFromStart: number;
}

export interface CreateRouteWithStopsDto extends CreateRouteDto {
  stops: CreateStopDto[];
}

export const routeAPI = {
  getAllRoutes: async (searchRoute: SearchRoute): Promise<Route[]> => {
    const response = await api.get<Route[]>(`/routes?from=${searchRoute.from}&to=${searchRoute.to}&date=${searchRoute.date}`);
    return response.data;
  },
  getAllRoutesAdmin: async (): Promise<Route[]> => {
    const response = await api.get<Route[]>('/routes');
    return response.data;
  },
  createRoute: async (data: CreateRouteWithStopsDto): Promise<Route> => {
    const response = await api.post<Route>('/routes', data);
    return response.data;
  },
};

