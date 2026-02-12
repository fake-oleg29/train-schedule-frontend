import { useEffect, useState } from 'react';
import TrainSearchForm from '../components/trains/TrainSearchForm';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { searchRoutes, clearError, clearRoutes } from '../store/slices/routeSlice';
import type { TrainSearchFormData } from '../utils/validation';
import { createTicket } from '../store/slices/ticketSlice';
import { Button } from '../components/ui/Button';

const Home = () => {
  const dispatch = useAppDispatch();
  const { routes, isLoading, error, lastSearch } = useAppSelector((state) => state.routes);
  const { isLoading: isTicketLoading } = useAppSelector((state) => state.tickets);
  const [routeErrors, setRouteErrors] = useState<Record<string, string>>({});
  const [loadingRoutes, setLoadingRoutes] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (!lastSearch) {
      dispatch(clearRoutes());
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, lastSearch]);

  const handleSearchSubmit = async (data: TrainSearchFormData) => {
    try {
      await dispatch(searchRoutes(data)).unwrap();
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSelectRoute = async (data: {
    routeId: string;
    fromStopId: string;
    toStopId: string;
    seatNumber: number;
  }) => {
    setLoadingRoutes((prev) => new Set(prev).add(data.routeId));
    setRouteErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[data.routeId];
      return newErrors;
    });

    try {
      await dispatch(createTicket(data)).unwrap();
      setRouteErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[data.routeId];
        return newErrors;
      });
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Failed to create ticket. Please try again.');
      setRouteErrors((prev) => ({
        ...prev,
        [data.routeId]: errorMessage,
      }));
    } finally {
      setLoadingRoutes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.routeId);
        return newSet;
      });
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-8 pb-6">
        <TrainSearchForm onSubmit={handleSearchSubmit} />
      </div>

      <div className="container mx-auto px-4 pb-8">
        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="max-w-4xl mx-auto text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {!isLoading && routes.length > 0 && lastSearch && (
          <div className="max-w-4xl mx-auto space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {routes.length} route{routes.length !== 1 ? 's' : ''}
            </h3>
            {routes.map((route) => {
              return (
                <div
                  key={route.id}
                  className="bg-white border border-gray-300 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-lg font-semibold text-gray-900">
                          Train #{route.train?.trainNumber || 'N/A'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {route.train?.totalSeats || 0} seats
                        </span>
                        {route.stops && route.stops.length > 0 && (
                          <span className="text-sm text-gray-500">
                            • {route.stops.length} stop{route.stops.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">From</p>
                            <p className="font-semibold text-gray-900">
                              {route.startStation?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {route.startStation?.departureDateTime
                                ? formatDateTime(route.startStation.departureDateTime)
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">To</p>
                            <p className="font-semibold text-gray-900">
                              {route.endStation?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {route.endStation?.arrivalDateTime
                                ? formatDateTime(route.endStation.arrivalDateTime)
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        {route.duration && (
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                            <span className="text-sm text-gray-500">Duration:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {route.duration.formatted || 
                               `${route.duration.hours}h ${route.duration.minutes}m`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      {route.ticketPrice > 0 && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            ${route.ticketPrice.toFixed(2)}
                          </div>
                        </div>
                      )}
                      <Button
                        onClick={() => handleSelectRoute({
                          routeId: route.id,
                          fromStopId: route.startStation.id,
                          toStopId: route.endStation.id,
                          seatNumber: Math.floor(Math.random() * (route.train?.totalSeats || 1)) + 1,
                        })}
                        disabled={loadingRoutes.has(route.id) || isTicketLoading}
                      >
                        {loadingRoutes.has(route.id) ? 'Loading...' : 'Select'}
                      </Button>
                    </div>
                  </div>
                  {routeErrors[route.id] && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {routeErrors[route.id]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && routes.length === 0 && !error && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-gray-500 text-lg">
              No search criteria entered
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;