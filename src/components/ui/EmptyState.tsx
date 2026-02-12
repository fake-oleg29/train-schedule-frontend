interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="border border-gray-300 p-4 text-center">
      <p>{message}</p>
    </div>
  );
};

