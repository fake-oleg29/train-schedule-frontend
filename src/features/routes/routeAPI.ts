import api from '../../services/api';
import type {  Route, SearchRoute } from './routeTypes';

export const routeAPI = {
  getAllRoutes: async (searchRoute: SearchRoute): Promise<Route[]> => {
    const response = await api.get<Route[]>(`/routes?from=${searchRoute.from}&to=${searchRoute.to}&date=${searchRoute.date}`);
    return response.data;
  },
};

