import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllRoutes, createRoute, clearError } from '../../store/slices/routeSlice';
import { fetchTrains } from '../../store/slices/trainSlice';
import type { CreateRouteFormData } from '../../utils/validation';
import RouteForm from '../../components/admin/RouteForm';
import { Modal } from '../../components/ui/Modal';

const AdminRoutesPage = () => {
  const dispatch = useAppDispatch();
  const { routes, isLoading, error } = useAppSelector((state) => state.routes);
  const { trains } = useAppSelector((state) => state.trains);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAllRoutes());
    dispatch(fetchTrains());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCreate = async (data: CreateRouteFormData) => {
    try {
      await dispatch(createRoute(data)).unwrap();
      setShowForm(false);
    } catch (err) {
      console.error('Create error:', err);
      throw err;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const getRouteName = (route: typeof routes[0]) => {
    if (route.startStation && route.endStation) {
      return `${route.startStation.name} → ${route.endStation.name}`;
    }
    if (route.stops && route.stops.length > 0) {
      const sortedStops = [...route.stops].sort((a, b) => a.stopNumber - b.stopNumber);
      const firstStop = sortedStops[0];
      const lastStop = sortedStops[sortedStops.length - 1];
      return `${firstStop.stationName} → ${lastStop.stationName}`;
    }
    return 'Unknown Route';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Routes Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          + Add Route
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title="Create New Route"
      >
        <RouteForm
          trains={trains}
          onSubmit={handleCreate}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </Modal>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading routes...</p>
        </div>
      )}

      {!isLoading && routes.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">No routes found.</p>
        </div>
      )}

      {!isLoading && routes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stops Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{getRouteName(route)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {route.train?.trainNumber || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {route.train?.totalSeats || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {route.stops?.length || 0}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRoutesPage;

