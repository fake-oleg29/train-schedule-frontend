import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        <div className="bg-white border border-gray-300">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <NavLink
                to="/admin/trains"
                end
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500'
                  }`
                }
              >
                Trains
              </NavLink>
              <NavLink
                to="/admin/routes"
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500'
                  }`
                }
              >
                Routes
              </NavLink>
            </nav>
          </div>
          
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

