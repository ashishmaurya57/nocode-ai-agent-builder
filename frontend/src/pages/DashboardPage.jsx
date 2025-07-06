import Dashboard from '../components/Dashboard';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
  <>
      <Dashboard /> {/* This always shows the agent list */}
      <Outlet />     {/* This renders create/edit agent form */}
    </>
  );
};

export default DashboardPage;