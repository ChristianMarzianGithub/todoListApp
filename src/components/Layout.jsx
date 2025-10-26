import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdBanner from './ads/AdBanner.jsx';
import logo from '../assets/logo.svg';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <Link to="/" className="brand-link">
            <img src={logo} alt="TodoStack logo" className="brand-logo" />
            <span className="brand-name">TodoStack</span>
          </Link>
          <span className="tagline">Stay organised everywhere</span>
        </div>
        <nav className="primary-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/legal">Legal</NavLink>
        </nav>
        <div className="auth-status">
          {user ? (
            <>
              <div className="user-chip">
                <span className="user-name">{user.username}</span>
                <span className={`plan-indicator plan-${user.plan}`}>
                  {user.plan === 'premium' ? 'Premium' : 'Free'}
                </span>
              </div>
              <button type="button" className="secondary" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <span className="login-hint">Sign in or explore for free</span>
          )}
        </div>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} TodoStack. All rights reserved.</p>
          <p className="footer-links">
            <Link to="/contact">Contact</Link>
            <Link to="/legal">Imprint & Privacy</Link>
          </p>
        </div>
        {user?.plan !== 'premium' && <AdBanner />}
      </footer>
    </div>
  );
};

export default Layout;
