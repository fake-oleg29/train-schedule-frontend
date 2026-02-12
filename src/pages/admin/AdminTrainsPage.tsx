import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTrains, createTrain, updateTrain, deleteTrain, clearError } from '../../store/slices/trainSlice';
import type { CreateTrainFormData } from '../../utils/validation';
import type { Train } from '../../features/trains/trainTypes';
import TrainForm from '../../components/admin/TrainForm';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/dateFormat';

const AdminTrainsPage = () => {
  const dispatch = useAppDispatch();
  const { trains, isLoading, error } = useAppSelector((state) => state.trains);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchTrains());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCreate = async (data: CreateTrainFormData) => {
    try {
      await dispatch(createTrain(data)).unwrap();
      setShowForm(false);
    } catch (err) {
      console.error('Create error:', err);
      throw err;
    }
  };

  const handleUpdate = async (data: CreateTrainFormData) => {
    if (!editingTrain) return;
    try {
      await dispatch(updateTrain({ id: editingTrain.id, data })).unwrap();
      setEditingTrain(null);
    } catch (err) {
      console.error('Update error:', err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this train?')) {
      try {
        await dispatch(deleteTrain(id)).unwrap();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleEdit = (train: Train) => {
    setEditingTrain(train);
  };

  const handleCancel = () => {
    setEditingTrain(null);
    setShowForm(false);
  };

  const isModalOpen = showForm || editingTrain !== null;

  const tableColumns = [
    {
      header: 'Train Number',
      accessor: (train: Train) => train.trainNumber,
    },
    {
      header: 'Total Seats',
      accessor: (train: Train) => train.totalSeats,
    },
    {
      header: 'Created At',
      accessor: (train: Train) => formatDate(train.createdAt),
    },
    {
      header: 'Actions',
      accessor: (train: Train) => (
        <div className="text-right">
          <Button
            variant="text"
            onClick={() => handleEdit(train)}
            className="text-blue-600 mr-3 px-2 py-1"
          >
            Edit
          </Button>
          <Button
            variant="text"
            onClick={() => handleDelete(train.id)}
            className="text-red-600 px-2 py-1"
          >
            Delete
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Trains Management"
        actionButton={{
          label: '+ Add Train',
          onClick: () => setShowForm(true),
        }}
      />

      {error && <ErrorAlert message={error} className="mb-4" />}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingTrain ? 'Edit Train' : 'Create New Train'}
      >
        <TrainForm
          train={editingTrain}
          onSubmit={editingTrain ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </Modal>

      {isLoading && trains.length === 0 && <LoadingState message="Loading trains..." />}

      {!isLoading && trains.length === 0 && (
        <EmptyState message="No trains found." />
      )}

      {!isLoading && trains.length > 0 && (
        <Table
          columns={tableColumns}
          data={trains}
          keyExtractor={(train) => train.id}
        />
      )}
    </div>
  );
};

export default AdminTrainsPage;

