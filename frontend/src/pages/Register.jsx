import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { apiError, validationErrors } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setBusy(true);
    try {
      // PRACTICE TASK: POST /api/register — response: { token: "...", user: {...} }
      const res = await api.post('/register', form);
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
        <h2>Register</h2>
        <p className="muted">
          Yeh form <code>POST /api/register</code> call karta hai — yeh endpoint aap ne banana hai!
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
            Name
            <input name="name" value={form.name} onChange={update} required />
          </label>
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
          <label>
            Confirm Password
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={update}
              required
            />
          </label>
          <button className="btn btn-primary full" disabled={busy}>
            {busy ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="muted center">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
