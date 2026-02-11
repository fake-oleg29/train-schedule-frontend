import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { token, user } = useAppSelector((state) => state.auth);
  const hasToken = token || localStorage.getItem('token');

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

