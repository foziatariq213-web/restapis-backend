import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiError } from '../api/client';
import { useAuth } from '../context/AuthContext';

// Logged-in user ke liye email verification page.
// Verification email ka link Laravel ke signed route par jata hai
// (GET /api/verify-email/{id}/{hash}) — verify kar ke wapas
// /dashboard?verified=1 par redirect karna aap ka backend task hai.
export default function VerifyEmail() {
  const { user } = useAuth();
  const verified = !!user?.email_verified_at;

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const resend = async () => {
    setStatus('');
    setError('');
    setBusy(true);
    try {
      // PRACTICE TASK: POST /api/email/verification-notification (auth:sanctum)
      const res = await api.post('/email/verification-notification');
      setStatus(res.data.status || res.data.message || 'Verification email dobara bhej di gayi ✔');
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page narrow">
      <div className="card">
        <h2>Email Verification ✉️</h2>

        {verified ? (
          <>
            <div className="alert success">
              Aap ka email <strong>{user.email}</strong> verified hai ✔ ({user.email_verified_at})
            </div>
            <Link to="/dashboard" className="btn btn-primary full">
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <p className="muted">
              <strong>{user?.email}</strong> abhi verified nahi hai. Verification email mein jo link
              hai woh Laravel ke <code>GET /api/verify-email/&#123;id&#125;/&#123;hash&#125;</code>{' '}
              (signed route) par jata hai — woh route banana aap ka task hai!
            </p>

            {error && <div className="alert">{error}</div>}
            {status && <div className="alert success">{status}</div>}

            <button className="btn btn-primary full" onClick={resend} disabled={busy}>
              {busy ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <p className="muted small">
              💡 <code>MAIL_MAILER=log</code> hai to email <code>storage/logs/laravel.log</code>{' '}
              mein milegi — signed link wahan se copy kar ke browser mein kholo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
