import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const AuthForms = () => {
  const { login, register } = useAuth();
  const [loginValues, setLoginValues] = useState({ username: '', password: '' });
  const [registerValues, setRegisterValues] = useState({
    username: '',
    password: '',
    plan: 'free',
  });

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    login(loginValues.username, loginValues.password);
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    register(registerValues);
  };

  return (
    <div className="auth-forms">
      <form className="card" onSubmit={handleLoginSubmit}>
        <h2>Sign in</h2>
        <label>
          Username
          <input
            type="text"
            value={loginValues.username}
            onChange={(event) =>
              setLoginValues((prev) => ({ ...prev, username: event.target.value }))
            }
            required
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={loginValues.password}
            onChange={(event) =>
              setLoginValues((prev) => ({ ...prev, password: event.target.value }))
            }
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="primary">
          Sign in
        </button>
      </form>

      <form className="card" onSubmit={handleRegisterSubmit}>
        <h2>Create account</h2>
        <label>
          Username
          <input
            type="text"
            value={registerValues.username}
            onChange={(event) =>
              setRegisterValues((prev) => ({ ...prev, username: event.target.value }))
            }
            required
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={registerValues.password}
            onChange={(event) =>
              setRegisterValues((prev) => ({ ...prev, password: event.target.value }))
            }
            required
            minLength={4}
            autoComplete="new-password"
          />
        </label>
        <fieldset>
          <legend>Choose plan</legend>
          <label className="radio-option">
            <input
              type="radio"
              name="plan"
              value="free"
              checked={registerValues.plan === 'free'}
              onChange={(event) =>
                setRegisterValues((prev) => ({ ...prev, plan: event.target.value }))
              }
            />
            Free · up to 20 lists with 100 items
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="plan"
              value="premium"
              checked={registerValues.plan === 'premium'}
              onChange={(event) =>
                setRegisterValues((prev) => ({ ...prev, plan: event.target.value }))
              }
            />
            Premium · 0.99 €/month for 10,000 lists
          </label>
        </fieldset>
        <button type="submit" className="secondary">
          Create account
        </button>
      </form>
    </div>
  );
};

export default AuthForms;
