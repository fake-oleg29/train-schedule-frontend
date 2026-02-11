import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';

import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const hasToken = token || localStorage.getItem('token');
    
    if (hasToken) {
      navigate('/', { replace: true });
      return;
    }
  }, [dispatch, navigate, token,]);

  return (
    <AuthLayout title="Sign Up">
      <RegisterForm />
    </AuthLayout>
  );
};
