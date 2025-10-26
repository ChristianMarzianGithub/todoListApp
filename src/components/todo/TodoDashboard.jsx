import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import TodoWorkspace from './TodoWorkspace.jsx';

const TodoDashboard = () => {
  const { user, limits, upgradePlan, downgradePlan } = useAuth();
  const [showLimits, setShowLimits] = useState(false);

  if (!user) {
    return null;
  }

  const planDescription =
    user.plan === 'premium'
      ? 'Premium members can create up to 10,000 lists with 10,000 items on each list.'
      : 'Free members can create up to 20 lists with 100 items on each list. Upgrade any time.';

  return (
    <div className="todo-dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Welcome, {user.username}!</h2>
          <p>{planDescription}</p>
          <button type="button" className="linklike" onClick={() => setShowLimits((value) => !value)}>
            {showLimits ? 'Hide limits' : 'Show current usage'}
          </button>
        </div>
        <div className="plan-actions">
          {user.plan === 'premium' ? (
            <button type="button" className="secondary" onClick={downgradePlan}>
              Switch to free plan
            </button>
          ) : (
            <button type="button" className="primary" onClick={upgradePlan}>
              Upgrade to Premium · 0.99 €/month
            </button>
          )}
        </div>
      </header>

      {showLimits && (
        <div className="limit-indicator">
          <p>
            You have <strong>{user.lists.length}</strong> of <strong>{limits.lists}</strong> lists.
          </p>
          <p>
            Each list can contain up to <strong>{limits.items}</strong> todo items.
          </p>
        </div>
      )}

      <TodoWorkspace />
    </div>
  );
};

export default TodoDashboard;
