import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api, { apiError, validationErrors } from '../api/client';

// Email ke reset link se user yahan aata hai:
//   /password-reset/{token}?email=user@example.com
// Token URL se aata hai, email query param se prefill hota hai.
export default function ResetPassword() {
  const { token } = useParams();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    email: params.get('email') || '',
    password: '',
    password_confirmation: '',
  });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setStatus('');
    setBusy(true);
    try {
      // PRACTICE TASK: POST /api/reset-password { token, email, password, password_confirmation }
      const res = await api.post('/reset-password', { ...form, token });
      setStatus(res.data.status || res.data.message || 'Password reset ho gaya ✔');
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
        <h2>Reset Password 🔒</h2>
        <p className="muted">
          Yeh form <code>POST /api/reset-password</code> call karta hai — token ke saath naya
          password set hota hai.
        </p>

        {errors.length > 0 && (
          <div className="alert">
            {errors.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}

        {status ? (
          <>
            <div className="alert success">{status}</div>
            <Link to="/login" className="btn btn-primary full">
              Login with new password
            </Link>
          </>
        ) : (
          <form onSubmit={submit}>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={update} required />
            </label>
            <label>
              New Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                required
              />
            </label>
            <label>
              Confirm New Password
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={update}
                required
              />
            </label>
            <button className="btn btn-primary full" disabled={busy}>
              {busy ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
