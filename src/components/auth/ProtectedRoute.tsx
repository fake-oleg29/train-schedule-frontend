import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token } = useAppSelector((state) => state.auth);
  const hasToken = token || localStorage.getItem('token');

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

