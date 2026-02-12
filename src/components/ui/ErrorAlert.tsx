interface ErrorAlertProps {
  message: string;
  className?: string;
}

export const ErrorAlert = ({ message, className = '' }: ErrorAlertProps) => {
  return (
    <div className={`bg-red-100 border border-red-400 text-red-800 px-3 py-2 ${className}`}>
      {message}
    </div>
  );
};

