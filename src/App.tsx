import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchCurrentUser } from './store/slices/authSlice';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import Header from './components/layout/Header';
import Home from './pages/Home';
import AdminLayout from './components/admin/AdminLayout';
import AdminTrainsPage from './pages/admin/AdminTrainsPage';
import AdminRoutesPage from './pages/admin/AdminRoutesPage';
import MyTicketsPage from './pages/MyTicketsPage';

function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Header />
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <Header />
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/trains" replace />} />
          <Route path="trains" element={<AdminTrainsPage />} />
          <Route path="routes" element={<AdminRoutesPage />} />
        </Route>
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <Header />
              <MyTicketsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
