import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuth } from '../store/slices/authSlice';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const hasToken = token || localStorage.getItem('token');
    
    if (hasToken && user) {
      navigate('/', { replace: true });
      return;
    }

    if (!user) {
      dispatch(clearAuth());
    }
  }, [dispatch, navigate, token, user]);

  return (
    <AuthLayout title="Sign In">
      <LoginForm />
    </AuthLayout>
  );
};
