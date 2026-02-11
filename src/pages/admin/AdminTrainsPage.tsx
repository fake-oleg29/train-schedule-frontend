import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTrains, createTrain, updateTrain, deleteTrain, clearError } from '../../store/slices/trainSlice';
import type { CreateTrainFormData } from '../../utils/validation';
import type { Train } from '../../features/trains/trainTypes';
import TrainForm from '../../components/admin/TrainForm';
import { Modal } from '../../components/ui/Modal';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Trains Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          + Add Train
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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

      {isLoading && trains.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading trains...</p>
        </div>
      )}

      {!isLoading && trains.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">No trains found. Create your first train!</p>
        </div>
      )}

      {!isLoading && trains.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trains.map((train) => (
                <tr key={train.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{train.trainNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{train.totalSeats}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(train.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(train)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(train.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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

export default AdminTrainsPage;

