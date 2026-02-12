import type { Route } from '../routes/routeTypes';
import type { Stop } from '../routes/routeTypes';
export interface Ticket {
  id: string;
  routeId: string;
  userId: string;
  fromStopId: string;
  toStopId: string;
  price: number;
  seatNumber: number;
  createdAt: string;
  updatedAt: string;
  route: Route;
  fromStop: Stop;
  toStop: Stop;
}
