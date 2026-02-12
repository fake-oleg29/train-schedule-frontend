import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../ui/Button';

const Header = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'border-b-2 border-blue-600 text-blue-600'
      : 'text-gray-600';
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Train Schedule
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className={`font-medium pb-4 ${isActive('/')}`}
              >
                Home
              </Link>
              {user && user.role.toLowerCase() === 'admin' && (
                <Link
                  to="/admin"
                  className={`font-medium pb-4 ${isActive('/admin')}`}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/my-tickets"
                className={`font-medium pb-4 ${isActive('/my-tickets')}`}
              >
                My Tickets
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
            )}
            <Button
              variant="text"
              onClick={handleLogout}
              className="text-sm px-2 py-1"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

