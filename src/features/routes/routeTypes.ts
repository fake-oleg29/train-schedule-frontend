import type { Train } from '../trains/trainTypes';
export interface Route {
  id: string;
  trainId: string;
  departureDateTime: string;
  createdAt: string;
  updatedAt: string;
  train?: Train;
  stops?: Stop[];
  ticketPrice: number;
  startStation: {
    name: string;
    departureDateTime: string;
  };
  endStation: {
    name: string;
    arrivalDateTime: string;
  };
  duration: {
    totalMinutes: number;
    hours: number;
    minutes: number;
    formatted: string;
  };
}

export interface SearchRoute {
  from: string;
  to: string;
  date: string;
}

export interface Stop {
  id: string;
  routeId: string;
  stationName: string;
  arrivalDateTime: string;
  departureDateTime: string;
  stopNumber: number;
  priceFromStart: number;
  createdAt: string;
  updatedAt: string;
}
