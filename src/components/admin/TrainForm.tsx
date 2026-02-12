import { useState, type FormEvent, useEffect } from 'react';
import { createTrainSchema, type CreateTrainFormData } from '../../utils/validation';
import type { Train } from '../../features/trains/trainTypes';
import { Button } from '../ui/Button';

interface TrainFormProps {
  train?: Train | null;
  onSubmit: (data: CreateTrainFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TrainForm = ({ train, onSubmit, onCancel, isLoading = false }: TrainFormProps) => {
  const [trainNumber, setTrainNumber] = useState('');
  const [totalSeats, setTotalSeats] = useState<number | ''>('');
  const [errors, setErrors] = useState<{ trainNumber?: string; totalSeats?: string }>({});

  useEffect(() => {
    if (train) {
      setTrainNumber(train.trainNumber);
      setTotalSeats(train.totalSeats);
    } else {
      setTrainNumber('');
      setTotalSeats('');
    }
    setErrors({});
  }, [train]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      trainNumber,
      totalSeats: typeof totalSeats === 'number' ? totalSeats : parseInt(totalSeats.toString()) || 0,
    };

    const result = createTrainSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: { trainNumber?: string; totalSeats?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof newErrors;
        if (field === 'trainNumber' || field === 'totalSeats') {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(result.data);
      if (!train) {
        setTrainNumber('');
        setTotalSeats('');
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label htmlFor="trainNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Train Number
        </label>
        <input
          id="trainNumber"
          type="text"
          value={trainNumber}
          onChange={(e) => {
            setTrainNumber(e.target.value);
            if (errors.trainNumber) setErrors((prev) => ({ ...prev, trainNumber: undefined }));
          }}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.trainNumber
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } focus:ring-2 focus:outline-none transition`}
          placeholder="e.g. TR001"
          disabled={isLoading}
        />
        {errors.trainNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.trainNumber}</p>
        )}
      </div>

      <div>
        <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700 mb-1">
          Total Seats
        </label>
        <input
          id="totalSeats"
          type="number"
          min="1"
          value={totalSeats}
          onChange={(e) => {
            const value = e.target.value === '' ? '' : parseInt(e.target.value);
            setTotalSeats(value);
            if (errors.totalSeats) setErrors((prev) => ({ ...prev, totalSeats: undefined }));
          }}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.totalSeats
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } focus:ring-2 focus:outline-none transition`}
          placeholder="e.g. 100"
          disabled={isLoading}
        />
        {errors.totalSeats && (
          <p className="text-red-500 text-sm mt-1">{errors.totalSeats}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Loading...' : train ? 'Update Train' : 'Create Train'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TrainForm;

