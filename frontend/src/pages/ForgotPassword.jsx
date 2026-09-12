import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiError, validationErrors } from '../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setStatus('');
    setBusy(true);
    try {
      // PRACTICE TASK: POST /api/forgot-password { email } — reset link email karta hai
      const res = await api.post('/forgot-password', { email });
      setStatus(res.data.status || res.data.message || 'Reset link bhej diya gaya hai — email check karo.');
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
        <h2>Forgot Password 🔑</h2>
        <p className="muted">
          Yeh form <code>POST /api/forgot-password</code> call karta hai. Laravel email mein reset
          link bhejega jo is frontend ke <code>/password-reset/&#123;token&#125;</code> page par
          aayega.
        </p>

        {errors.length > 0 && (
          <div className="alert">
            {errors.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}
        {status && <div className="alert success">{status}</div>}

        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button className="btn btn-primary full" disabled={busy}>
            {busy ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="muted small">
          💡 Local testing: <code>MAIL_MAILER=log</code> hai to email asal mein nahi jati —{' '}
          <code>storage/logs/laravel.log</code> mein milegi. Wahan se link copy kar ke browser mein
          kholo.
        </p>

        <p className="muted center">
          <Link to="/login">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
