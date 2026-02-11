import { useState, type FormEvent } from 'react';
import { createRouteSchema, type CreateRouteFormData, type CreateStopFormData } from '../../utils/validation';
import type { Train } from '../../features/trains/trainTypes';

interface RouteFormProps {
  trains: Train[];
  onSubmit: (data: CreateRouteFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RouteForm = ({ trains, onSubmit, onCancel, isLoading = false }: RouteFormProps) => {
  const [trainId, setTrainId] = useState('');
  const [departureDateTime, setDepartureDateTime] = useState('');
  const [stops, setStops] = useState<CreateStopFormData[]>([
    {
      stationName: '',
      arrivalDateTime: '',
      departureDateTime: '',
      stopNumber: 1,
      priceFromStart: 0,
    },
  ]);
  const [errors, setErrors] = useState<{
    trainId?: string;
    departureDateTime?: string;
    stops?: { [key: number]: { [key: string]: string } };
  }>({});

  const addStop = () => {
    setStops([
      ...stops,
      {
        stationName: '',
        arrivalDateTime: '',
        departureDateTime: '',
        stopNumber: stops.length + 1,
        priceFromStart: 0,
      },
    ]);
  };

  const removeStop = (index: number) => {
    if (stops.length > 1) {
      const newStops = stops.filter((_, i) => i !== index);
      setStops(newStops.map((stop, i) => ({ ...stop, stopNumber: i + 1 })));
    }
  };

  const updateStop = (index: number, field: keyof CreateStopFormData, value: string | number) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setStops(newStops);
    if (errors.stops?.[index]?.[field]) {
      const newErrors = { ...errors };
      if (newErrors.stops?.[index]) {
        delete newErrors.stops[index][field];
      }
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData: CreateRouteFormData = {
      trainId,
      departureDateTime: new Date(departureDateTime).toISOString(),
      stops: stops.map((stop) => ({
        ...stop,
        arrivalDateTime: new Date(stop.arrivalDateTime).toISOString(),
        departureDateTime: new Date(stop.departureDateTime).toISOString(),
        priceFromStart: typeof stop.priceFromStart === 'number' ? stop.priceFromStart : parseFloat(String(stop.priceFromStart)) || 0,
      })),
    };

    const result = createRouteSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path;
        if (path[0] === 'trainId') {
          newErrors.trainId = issue.message;
        } else if (path[0] === 'departureDateTime') {
          newErrors.departureDateTime = issue.message;
        } else if (path[0] === 'stops' && path.length > 1) {
          const stopIndex = path[1] as number;
          const field = path[2] as string;
          if (!newErrors.stops) {
            newErrors.stops = {};
          }
          if (!newErrors.stops[stopIndex]) {
            newErrors.stops[stopIndex] = {};
          }
          newErrors.stops[stopIndex][field] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(result.data);
      setTrainId('');
      setDepartureDateTime('');
      setStops([
        {
          stationName: '',
          arrivalDateTime: '',
          departureDateTime: '',
          stopNumber: 1,
          priceFromStart: 0,
        },
      ]);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="trainId" className="block text-sm font-medium text-gray-700 mb-1">
          Train
        </label>
        <select
          id="trainId"
          value={trainId}
          onChange={(e) => {
            setTrainId(e.target.value);
            if (errors.trainId) setErrors((prev) => ({ ...prev, trainId: undefined }));
          }}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.trainId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } focus:ring-2 focus:outline-none transition`}
          disabled={isLoading}
        >
          <option value="">Select a train</option>
          {trains.map((train) => (
            <option key={train.id} value={train.id}>
              {train.trainNumber} ({train.totalSeats} seats)
            </option>
          ))}
        </select>
        {errors.trainId && <p className="text-red-500 text-sm mt-1">{errors.trainId}</p>}
      </div>

      <div>
        <label htmlFor="departureDateTime" className="block text-sm font-medium text-gray-700 mb-1">
          Departure Date & Time
        </label>
        <input
          id="departureDateTime"
          type="datetime-local"
          value={departureDateTime}
          onChange={(e) => {
            setDepartureDateTime(e.target.value);
            if (errors.departureDateTime)
              setErrors((prev) => ({ ...prev, departureDateTime: undefined }));
          }}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.departureDateTime
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } focus:ring-2 focus:outline-none transition`}
          disabled={isLoading}
        />
        {errors.departureDateTime && (
          <p className="text-red-500 text-sm mt-1">{errors.departureDateTime}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Stops</label>
          <button
            type="button"
            onClick={addStop}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
          >
            <span>+</span> Add Stop
          </button>
        </div>

        <div className="space-y-4">
          {stops.map((stop, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Stop #{stop.stopNumber}</span>
                {stops.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Station Name</label>
                <input
                  type="text"
                  value={stop.stationName}
                  onChange={(e) => updateStop(index, 'stationName', e.target.value)}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    errors.stops?.[index]?.stationName
                      ? 'border-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-1 focus:outline-none`}
                  placeholder="Station name"
                  disabled={isLoading}
                />
                {errors.stops?.[index]?.stationName && (
                  <p className="text-red-500 text-xs mt-1">{errors.stops[index].stationName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Arrival Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={stop.arrivalDateTime}
                    onChange={(e) => updateStop(index, 'arrivalDateTime', e.target.value)}
                    className={`w-full px-3 py-2 rounded border text-sm ${
                      errors.stops?.[index]?.arrivalDateTime
                        ? 'border-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } focus:ring-1 focus:outline-none`}
                    disabled={isLoading}
                  />
                  {errors.stops?.[index]?.arrivalDateTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.stops[index].arrivalDateTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Departure Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={stop.departureDateTime}
                    onChange={(e) => updateStop(index, 'departureDateTime', e.target.value)}
                    className={`w-full px-3 py-2 rounded border text-sm ${
                      errors.stops?.[index]?.departureDateTime
                        ? 'border-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } focus:ring-1 focus:outline-none`}
                    disabled={isLoading}
                  />
                  {errors.stops?.[index]?.departureDateTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.stops[index].departureDateTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Stop Number</label>
                  <input
                    type="number"
                    min="1"
                    value={stop.stopNumber}
                    onChange={(e) =>
                      updateStop(index, 'stopNumber', parseInt(e.target.value) || 1)
                    }
                    className={`w-full px-3 py-2 rounded border text-sm ${
                      errors.stops?.[index]?.stopNumber
                        ? 'border-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } focus:ring-1 focus:outline-none`}
                    disabled={isLoading}
                  />
                  {errors.stops?.[index]?.stopNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.stops[index].stopNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Price From Start
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={stop.priceFromStart}
                    onChange={(e) =>
                      updateStop(index, 'priceFromStart', parseFloat(e.target.value) || 0)
                    }
                    className={`w-full px-3 py-2 rounded border text-sm ${
                      errors.stops?.[index]?.priceFromStart
                        ? 'border-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } focus:ring-1 focus:outline-none`}
                    disabled={isLoading}
                  />
                  {errors.stops?.[index]?.priceFromStart && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.stops[index].priceFromStart}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create Route'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RouteForm;

