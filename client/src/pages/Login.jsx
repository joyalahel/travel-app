import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, signup as signupApi } from '../api/api';
import { useAuth } from '../context/AuthContext'
import './Login.css';

function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = mode === 'login'
        ? await loginApi(form.email, form.password)
        : await signupApi(form.name, form.email, form.password);

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>

        <div className="mode-toggle">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
            type="button"
          >
            Sign in
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="field-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;