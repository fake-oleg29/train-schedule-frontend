interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
  return (
    <div className="text-center py-6">
      <p>{message}</p>
    </div>
  );
};

