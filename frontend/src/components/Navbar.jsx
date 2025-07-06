import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Helper function to check if current route is active
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <BSNavbar 
      bg="white" 
      expand="lg" 
      className="shadow-sm"
      style={{ 
        borderBottom: '1px solid #e9ecef',
        minHeight: '75px',
        backgroundColor: '#ffffff !important'
      }}
    >
      <Container className="container-lg">
        <BSNavbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold text-decoration-none d-flex align-items-center"
          style={{ 
            color: '#2563eb',
            fontSize: '1.75rem',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}
        >
          <span className="me-2" style={{ fontSize: '2rem' }}>🤖</span>
          AI Agent Platform
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle 
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none"
          style={{
            padding: '0.5rem',
            borderRadius: '8px'
          }}
        />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-1">
            {currentUser ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className={`px-4 py-2 rounded-pill text-decoration-none fw-medium d-flex align-items-center ${
                    isActiveRoute('/') && location.pathname === '/'
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-dark'
                  }`}
                  style={{
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    backgroundColor: isActiveRoute('/') && location.pathname === '/' ? '#2563eb' : 'transparent',
                    color: isActiveRoute('/') && location.pathname === '/' ? '#ffffff' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/') || location.pathname !== '/') {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.color = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/') || location.pathname !== '/') {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <span className="me-2">🏠</span>
                  Home
                </Nav.Link>

                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-pill text-decoration-none fw-medium d-flex align-items-center ${
                    isActiveRoute('/dashboard') 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-dark'
                  }`}
                  style={{
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    backgroundColor: isActiveRoute('/dashboard') ? '#2563eb' : 'transparent',
                    color: isActiveRoute('/dashboard') ? '#ffffff' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/dashboard')) {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.color = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/dashboard')) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <span className="me-2">📊</span>
                  Dashboard
                </Nav.Link>

                <Nav.Link 
                  as={Link} 
                  to="/create-agent" 
                  className={`px-4 py-2 rounded-pill text-decoration-none fw-medium d-flex align-items-center ${
                    isActiveRoute('/create-agent') 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-dark'
                  }`}
                  style={{
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    backgroundColor: isActiveRoute('/create-agent') ? '#2563eb' : 'transparent',
                    color: isActiveRoute('/create-agent') ? '#ffffff' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/create-agent')) {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.color = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/create-agent')) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <span className="me-2">⚡</span>
                  Create Agent
                </Nav.Link>

                <Nav.Link 
                  as={Link} 
                  to="/automation" 
                  className={`px-4 py-2 rounded-pill text-decoration-none fw-medium d-flex align-items-center ${
                    isActiveRoute('/automation') 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-dark'
                  }`}
                  style={{
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    backgroundColor: isActiveRoute('/automation') ? '#2563eb' : 'transparent',
                    color: isActiveRoute('/automation') ? '#ffffff' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/automation')) {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.color = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/automation')) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <span className="me-2">🔄</span>
                  Automate
                </Nav.Link>

                <div className="vr mx-3" style={{ height: '30px', opacity: '0.3' }}></div>

                <Button
                  variant="outline-danger"
                  onClick={logout}
                  className="px-4 py-2 rounded-pill fw-medium border-2 d-flex align-items-center"
                  style={{
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    borderColor: '#dc3545',
                    color: '#dc3545',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc3545';
                    e.target.style.color = '#ffffff';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#dc3545';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <span className="me-2">🚪</span>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className={`px-4 py-2 rounded-pill text-decoration-none fw-medium d-flex align-items-center ${
                    isActiveRoute('/login') 
                      ? 'bg-outline-primary text-primary fw-bold' 
                      : 'text-dark'
                  }`}
                  style={{
                    transition: 'all 0.3s ease',
                    fontWeight: isActiveRoute('/login') ? '700' : '600',
                    fontSize: '0.95rem',
                    backgroundColor: isActiveRoute('/login') ? '#eff6ff' : 'transparent',
                    color: isActiveRoute('/login') ? '#2563eb' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/login')) {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.color = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/login')) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  <span className="me-2">🔐</span>
                  Login
                </Nav.Link>
                
                <Button
                  as={Link}
                  to="/register"
                  variant={isActiveRoute('/register') ? 'primary' : 'outline-primary'}
                  className="px-4 py-2 rounded-pill fw-medium border-2 text-decoration-none d-flex align-items-center"
                  style={{
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    backgroundColor: isActiveRoute('/register') ? '#2563eb' : 'transparent',
                    borderColor: '#2563eb',
                    color: isActiveRoute('/register') ? '#ffffff' : '#2563eb',
                    boxShadow: isActiveRoute('/register') ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/register')) {
                      e.target.style.backgroundColor = '#2563eb';
                      e.target.style.color = '#ffffff';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/register')) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#2563eb';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <span className="me-2">✨</span>
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;