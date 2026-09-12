import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { API_BASE, apiError, validationErrors } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setBusy(true);
    try {
      // PRACTICE TASK: POST /api/login — response: { token: "...", user: {...} }
      const res = await api.post('/login', form);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const list = validationErrors(err);
      setErrors(list.length ? list : [apiError(err)]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page narrow">
      <div className="card">
        <h2>Login</h2>
        <p className="muted">
          Yeh form <code>POST /api/login</code> call karta hai — Sanctum token wapis aana chahiye.
        </p>

        {errors.length > 0 && (
          <div className="alert">
            {errors.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}

        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={update} required />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              required
            />
          </label>
          <button className="btn btn-primary full" disabled={busy}>
            {busy ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="muted center">
          <Link to="/forgot-password">Password bhool gayin?</Link>
        </p>

        <div className="divider">ya phir OAuth se (Socialite practice)</div>

        {/* PRACTICE TASK: yeh Laravel web routes hain — Socialite se banao.
            Callback mein token bana kar wapis /oauth/callback?token=... par redirect karo */}
        <div className="oauth-buttons">
          <a className="btn btn-outline full" href={`${API_BASE}/auth/google/redirect`}>
            Continue with Google
          </a>
          <a className="btn btn-outline full" href={`${API_BASE}/auth/github/redirect`}>
            Continue with GitHub
          </a>
        </div>

        <p className="muted center">
          Account nahi hai? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
