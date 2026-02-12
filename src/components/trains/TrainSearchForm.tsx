import { useState, type FormEvent } from 'react';
import { trainSearchSchema, type TrainSearchFormData } from '../../utils/validation';
import { Button } from '../ui/Button';

interface TrainSearchFormProps {
  onSubmit?: (data: TrainSearchFormData) => void;
}

const TrainSearchForm = ({ onSubmit }: TrainSearchFormProps) => {
  const [errors, setErrors] = useState<{ from?: string; to?: string; date?: string }>({});
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError(null);

    const formData = { from, to, date };
    const result = trainSearchSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: { from?: string; to?: string; date?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof newErrors;
        if (field === 'from' || field === 'to' || field === 'date') {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit({
          from: result.data.from.trim(),
          to: result.data.to.trim(),
          date: result.data.date,
        });
      }
    } catch (err) {
      setError('Error searching for trains. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-300 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Search Trains</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Station
            </label>
            <input
              id="from"
              type="text"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                if (errors.from) setErrors((prev) => ({ ...prev, from: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.from
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } focus:ring-2 focus:outline-none transition`}
              placeholder="e.g. Kyiv"
              disabled={isLoading}
            />
            {errors.from && (
              <p className="text-red-500 text-sm mt-1">{errors.from}</p>
            )}
          </div>

          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Station
            </label>
            <input
              id="to"
              type="text"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                if (errors.to) setErrors((prev) => ({ ...prev, to: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.to
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } focus:ring-2 focus:outline-none transition`}
              placeholder="e.g. Lviv"
              disabled={isLoading}
            />
            {errors.to && (
              <p className="text-red-500 text-sm mt-1">{errors.to}</p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.date
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } focus:ring-2 focus:outline-none transition`}
              disabled={isLoading}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Loading...' : 'Search Trains'}
        </Button>
      </form>
    </div>
  );
};

export default TrainSearchForm;