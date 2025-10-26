import AuthForms from '../components/auth/AuthForms.jsx';
import TodoDashboard from '../components/todo/TodoDashboard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { user, startGuestSession, authError, authSuccess, resetMessages } = useAuth();

  return (
    <div className="page home-page">
      {!user && (
        <section className="hero">
          <div className="hero-text">
            <h1>Organise everything with TodoStack</h1>
            <p>
              Start with the free plan, create up to 20 lists with 100 items each and upgrade to
              Premium whenever you are ready. Your data stays on this device until you connect a
              database.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary" onClick={startGuestSession}>
                Try the free version now
              </button>
              <p className="hero-note">No account required to explore.</p>
            </div>
          </div>
          <div className="hero-forms">
            <AuthForms />
          </div>
        </section>
      )}

      {(authError || authSuccess) && (
        <div className={`auth-message ${authError ? 'error' : 'success'}`} role="status">
          <p>{authError || authSuccess}</p>
          <button type="button" onClick={resetMessages} className="linklike">
            Dismiss
          </button>
        </div>
      )}

      {user && (
        <section className="todo-section">
          <TodoDashboard />
        </section>
      )}
    </div>
  );
};

export default Home;
