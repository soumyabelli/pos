import { Link } from "react-router-dom";
import "../index.css"; // We'll retain the global reset and fonts

export default function Landing() {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="logo">
          <span className="logo-icon"></span>
          <span className="logo-text">Urban Crust</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#benefits">Benefits</a>
          <Link to="/login" className="nav-btn-secondary">Login</Link>
          <Link to="/pos" className="nav-btn-primary">Launch POS</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge">🚀 The Future of Retail</div>
          <h1 className="hero-title">
            Manage your store with <br />
            <span className="text-gradient">Urban Crust Billing</span>
          </h1>
          <p className="hero-subtitle">
            A lightning-fast, secure, and fully synced POS system.
            Manage multiple stores, track inventory in real-time, and view
            powerful analytics from one beautiful dashboard.
          </p>
          <div className="hero-actions">
            <Link to="/pos" className="btn-primary-large">
              Launch POS Terminal
            </Link>
            <Link to="/login" className="btn-secondary-large">
              Admin Login
            </Link>
          </div>
        </div>

        {/* Floating Mockup Elements */}
        <div className="hero-mockup-wrapper">
          <div className="mockup-glass-card">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="mockup-title">Today's Sales</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-stat">
                <span className="stat-value">$12,450</span>
                <span className="stat-label text-success">+14% vs yesterday</span>
              </div>
              <div className="mockup-chart">
                {/* Mock chart bars */}
                <div className="bar" style={{ height: "40%" }}></div>
                <div className="bar" style={{ height: "60%" }}></div>
                <div className="bar" style={{ height: "30%" }}></div>
                <div className="bar" style={{ height: "80%" }}></div>
                <div className="bar" style={{ height: "50%" }}></div>
                <div className="bar" style={{ height: "90%" }}></div>
                <div className="bar active-bar" style={{ height: "100%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Everything you need to <span className="text-gradient">scale</span></h2>
          <p>Built for speed and reliability in fast-paced retail environments.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast Billing</h3>
            <p>Process orders instantly with a barcode scanner or tap. No lag, no waiting.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Auto Inventory Sync</h3>
            <p>Every sale instantly updates your stock levels across all your connected stores.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏪</div>
            <h3>Multi-Store Management</h3>
            <p>Control inventory, staff, and analytics for 100+ stores from a single admin panel.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Role-Based Access</h3>
            <p>Secure logins for Admins, Managers, and Cashiers with strict permission controls.</p>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <footer className="landing-footer">
        <div className="footer-content">
          <h2>Ready to upgrade your checkout?</h2>
          <Link to="/pos" className="btn-primary-large glow">Start Selling Now</Link>
        </div>
      </footer>
    </div>
  );
}
