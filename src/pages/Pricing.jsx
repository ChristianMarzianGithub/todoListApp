import { useAuth } from '../context/AuthContext.jsx';

const Pricing = () => {
  const { user, limits, upgradePlan } = useAuth();
  const isPremium = user?.plan === 'premium';

  return (
    <div className="page pricing-page">
      <header className="pricing-hero">
        <h1>Choose the right plan for your productivity</h1>
        <p>
          Start on the free tier and keep your lists synced to this device. When you are ready,
          unlock premium capacity for just 0.99 € per month.
        </p>
      </header>
      <div className="pricing-grid">
        <article className={`card ${!isPremium ? 'highlight' : ''}`}>
          <h2>Free</h2>
          <p className="price">0 €</p>
          <ul>
            <li>20 lists with up to 100 items each</li>
            <li>Ads help keep the lights on</li>
            <li>Local data storage</li>
          </ul>
          <p className="current-status">
            {user && !isPremium ? 'Your current plan' : 'Great for getting started'}
          </p>
        </article>
        <article className={`card ${isPremium ? 'highlight' : ''}`}>
          <h2>Premium</h2>
          <p className="price">0.99 € / month</p>
          <ul>
            <li>Create up to 10,000 lists</li>
            <li>10,000 items per list</li>
            <li>Ad-free focus mode</li>
          </ul>
          <button
            type="button"
            className="primary"
            onClick={upgradePlan}
            disabled={isPremium || !user || user.isGuest}
          >
            {isPremium ? 'You are premium' : user?.isGuest ? 'Create an account to upgrade' : 'Upgrade now'}
          </button>
          {isPremium && (
            <p className="current-status">Enjoy the unlimited productivity!</p>
          )}
          {!user && <p className="current-status">Sign in to upgrade.</p>}
          {user?.isGuest && (
            <p className="current-status">Guest sessions cannot become premium. Register first.</p>
          )}
          {user && (
            <p className="current-status">
              You currently use <strong>{user.lists.length}</strong> of <strong>{limits.lists}</strong>{' '}
              lists.
            </p>
          )}
        </article>
      </div>
    </div>
  );
};

export default Pricing;
