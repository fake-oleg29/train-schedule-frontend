import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllRoutes, createRoute, clearError } from '../../store/slices/routeSlice';
import { fetchTrains } from '../../store/slices/trainSlice';
import type { CreateRouteFormData } from '../../utils/validation';
import RouteForm from '../../components/admin/RouteForm';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Table } from '../../components/ui/Table';
import { formatDateTime } from '../../utils/dateFormat';
import type { Route } from '../../features/routes/routeTypes';

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
      dispatch(fetchAllRoutes());
    } catch (err) {
      console.error('Create error:', err);
      throw err;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const getRouteName = (route: Route) => {
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

  const tableColumns = [
    {
      header: 'Route Name',
      accessor: (route: Route) => getRouteName(route),
    },
    {
      header: 'Departure Time',
      accessor: (route: Route) =>
        route.startStation?.departureDateTime
          ? formatDateTime(route.startStation.departureDateTime)
          : 'N/A',
    },
    {
      header: 'Arrival Time',
      accessor: (route: Route) =>
        route.endStation?.arrivalDateTime
          ? formatDateTime(route.endStation.arrivalDateTime)
          : 'N/A',
    },
    {
      header: 'Train Number',
      accessor: (route: Route) => route.train?.trainNumber || 'N/A',
    },
    {
      header: 'Total Seats',
      accessor: (route: Route) => route.train?.totalSeats || 0,
    },
    {
      header: 'Stops Count',
      accessor: (route: Route) => route.stops?.length || 0,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Routes Management"
        actionButton={{
          label: '+ Add Route',
          onClick: () => setShowForm(true),
        }}
      />

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

      {error && <ErrorAlert message={error} className="mb-4" />}

      {isLoading && <LoadingState message="Loading routes..." />}

      {!isLoading && routes.length === 0 && <EmptyState message="No routes found." />}

      {!isLoading && routes.length > 0 && (
        <Table
          columns={tableColumns}
          data={routes}
          keyExtractor={(route) => route.id}
        />
      )}
    </div>
  );
};

export default AdminRoutesPage;

