import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AgentPage from './pages/AgentPage';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import AgentForm from './components/AgentForm';
import ChatInterfaceWrapper from './ChatInterfaceWrapper';
import AutomationForm from './components/AutomationForm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard/chat/:id" element={<ChatInterfaceWrapper />} />
              <Route path="/create-agent" element={<AgentForm />} />
              <Route path="/edit-agent/:id" element={<AgentForm />} />

              {/* ✅ Protect the following routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<DashboardPage />}>
                  <Route path="create-agent" element={<AgentForm />} />
                  <Route path="edit-agent/:id" element={<AgentForm />} />
                </Route>

                <Route path="/agent/:id" element={<AgentPage />} />
                <Route path="/automation" element={<AutomationForm />} /> {/* ✅ Automation page */}
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
