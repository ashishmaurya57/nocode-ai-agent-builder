import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: '🤖',
      title: 'Intelligent Agents',
      description: 'Create sophisticated AI agents without writing a single line of code'
    },
    {
      icon: '⚡',
      title: 'Smart Automation',
      description: 'Automate complex workflows with drag-and-drop simplicity'
    },
    {
      icon: '🔗',
      title: 'Seamless Integration',
      description: 'Connect with your favorite tools and platforms effortlessly'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Monitor and optimize your AI agents with detailed insights'
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100 py-5">
            <Col lg={6} className="text-center text-lg-start">
              <div className="hero-content">
                <h1 className="hero-title">
                  Build Powerful 
                  <span className="text-gradient"> AI Agents</span>
                  <br />Without Code
                </h1>
                <p className="hero-subtitle">
                  Transform your ideas into intelligent automation. Create, customize, 
                  and deploy AI agents that work 24/7 to streamline your workflows.
                </p>
                <div className="hero-stats mb-4">
                  <div className="stat-item">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Active Agents</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">99.9%</span>
                    <span className="stat-label">Uptime</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">5M+</span>
                    <span className="stat-label">Tasks Automated</span>
                  </div>
                </div>
                {currentUser ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="cta-button"
                    onClick={() => navigate('/dashboard')}
                  >
                    <span>Go to Dashboard</span>
                    <i className="arrow">→</i>
                  </Button>
                ) : (
                  <div className="cta-buttons">
                    <Button
                      variant="primary"
                      size="lg"
                      className="cta-button primary"
                      onClick={() => navigate('/register')}
                    >
                      <span>Start Building Free</span>
                      <i className="arrow">→</i>
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="cta-button secondary"
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </Button>
                  </div>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-visual">
                <div className="agent-showcase">
                  <div className="agent-node main-agent">
                    <div className="agent-icon">🤖</div>
                    <div className="agent-pulse"></div>
                  </div>
                  <div className="agent-node secondary-agent agent-1">
                    <div className="agent-icon">📧</div>
                  </div>
                  <div className="agent-node secondary-agent agent-2">
                    <div className="agent-icon">📊</div>
                  </div>
                  <div className="agent-node secondary-agent agent-3">
                    <div className="agent-icon">🔔</div>
                  </div>
                  <div className="connection-line line-1"></div>
                  <div className="connection-line line-2"></div>
                  <div className="connection-line line-3"></div>
                  <div className="floating-data data-1">Processing...</div>
                  <div className="floating-data data-2">Analyzing...</div>
                  <div className="floating-data data-3">Automating...</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 className="section-title">Why Choose Our Platform?</h2>
              <p className="section-subtitle">
                Everything you need to create, deploy, and manage AI agents at scale
              </p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <Card className="feature-card h-100">
                  <Card.Body className="text-center">
                    <div className="feature-icon">{feature.icon}</div>
                    <h5 className="feature-title">{feature.title}</h5>
                    <p className="feature-description">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 className="cta-title">Ready to Automate Your World?</h2>
              <p className="cta-subtitle">
                Join thousands of users who are already building the future with AI
              </p>
              {!currentUser && (
                <Button
                  variant="primary"
                  size="lg"
                  className="cta-button"
                  onClick={() => navigate('/register')}
                >
                  <span>Get Started Today</span>
                  <i className="arrow">→</i>
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        .homepage {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .text-gradient {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        @media (min-width: 992px) {
          .hero-stats {
            justify-content: flex-start;
          }
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #FFD700;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (min-width: 992px) {
          .cta-buttons {
            justify-content: flex-start;
          }
        }

        .cta-button {
          position: relative;
          padding: 1rem 2rem;
          font-weight: 600;
          border-radius: 50px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow: hidden;
        }

        .cta-button.primary {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          border: none;
          color: #333;
        }

        .cta-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3);
        }

        .cta-button.secondary {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
        }

        .cta-button.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .cta-button .arrow {
          transition: transform 0.3s ease;
        }

        .cta-button:hover .arrow {
          transform: translateX(3px);
        }

        .hero-visual {
          position: relative;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .agent-showcase {
          position: relative;
          width: 300px;
          height: 300px;
        }

        .agent-node {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          animation: pulse 2s ease-in-out infinite;
        }

        .main-agent {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          font-size: 2rem;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #333;
        }

        .agent-pulse {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 2px solid #FFD700;
          border-radius: 50%;
          animation: pulse-ring 2s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        .agent-1 {
          top: 20%;
          left: 20%;
          animation-delay: 0.2s;
        }

        .agent-2 {
          top: 20%;
          right: 20%;
          animation-delay: 0.4s;
        }

        .agent-3 {
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 0.6s;
        }

        .connection-line {
          position: absolute;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          height: 2px;
          opacity: 0.6;
          animation: data-flow 3s ease-in-out infinite;
        }

        .line-1 {
          top: 35%;
          left: 35%;
          width: 30%;
          transform: rotate(45deg);
        }

        .line-2 {
          top: 35%;
          right: 35%;
          width: 30%;
          transform: rotate(-45deg);
        }

        .line-3 {
          bottom: 35%;
          left: 50%;
          width: 30%;
          transform: translateX(-50%) rotate(90deg);
        }

        @keyframes data-flow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .floating-data {
          position: absolute;
          background: rgba(255, 215, 0, 0.9);
          color: #333;
          padding: 0.25rem 0.5rem;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          animation: float-data 4s ease-in-out infinite;
        }

        .data-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .data-2 {
          top: 10%;
          right: 10%;
          animation-delay: 1.3s;
        }

        .data-3 {
          bottom: 10%;
          right: 20%;
          animation-delay: 2.6s;
        }

        @keyframes float-data {
          0%, 100% { transform: translateY(0px); opacity: 0.7; }
          50% { transform: translateY(-10px); opacity: 1; }
        }

        .features-section {
          background: #f8f9fa;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .feature-card {
          border: none;
          border-radius: 20px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .feature-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .cta-section {
          background: linear-gradient(135deg, #333 0%, #555 100%);
          color: white;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-stats {
            justify-content: center;
          }
          
          .cta-buttons {
            justify-content: center;
          }
          
          .agent-showcase {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;