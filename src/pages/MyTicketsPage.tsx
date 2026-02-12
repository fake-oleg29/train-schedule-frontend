import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearError, fetchTickets } from '../store/slices/ticketSlice';
import { useEffect } from 'react';
import { returnTicket } from '../store/slices/ticketSlice';
import { Button } from '../components/ui/Button';
const MyTicketsPage = () => {
  const dispatch = useAppDispatch();
  const { tickets, isLoading, error } = useAppSelector((state) => state.tickets);
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleReturnTicket = async (ticketId: string) => {
    try {
      await dispatch(returnTicket(ticketId)).unwrap();
    } catch (err) {
      console.error('Return ticket error:', err);
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
      <div className="container mx-auto px-4 py-8">

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

        {!isLoading && tickets.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white border border-gray-300 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-lg font-semibold text-gray-900">
                        Train #{ticket.route.train?.trainNumber || 'N/A'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Seat {ticket.seatNumber}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">From</p>
                          <p className="font-semibold text-gray-900">
                            {ticket.fromStop?.stationName || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {ticket.fromStop?.departureDateTime
                              ? formatDateTime(ticket.fromStop.departureDateTime)
                              : 'N/A'}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">To</p>
                          <p className="font-semibold text-gray-900">
                            {ticket.toStop?.stationName || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {ticket.toStop?.arrivalDateTime
                              ? formatDateTime(ticket.toStop.arrivalDateTime)
                              : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {ticket.route?.departureDateTime && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                          <span className="text-sm text-gray-500">Departure:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDateTime(ticket.route.departureDateTime)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {ticket.price > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Price</p>
                        <div className="text-2xl font-bold text-blue-600">
                          ${Number(ticket.price).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Button variant="danger" onClick={() => handleReturnTicket(ticket.id)}>
                      Return Ticket
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && tickets.length === 0 && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-gray-500 text-lg">
              No tickets found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;

