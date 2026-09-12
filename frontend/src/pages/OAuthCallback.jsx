import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// OAuth flow ka aakhri step:
// Laravel Socialite callback token bana kar user ko yahan redirect karega:
//   http://localhost:5173/oauth/callback?token=XYZ
// Hum token save kar ke dashboard par le jaate hain.
export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      login(token);
      navigate('/dashboard', { replace: true });
    } else {
      setError(
        params.get('error') ||
          'Token nahi mila. Laravel callback ko ?token=... ke saath redirect karna chahiye tha.'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page narrow">
      <div className="card center">
        {error ? (
          <>
            <h2>OAuth Failed 😅</h2>
            <div className="alert">{error}</div>
            <Link to="/login" className="btn btn-primary">
              Back to Login
            </Link>
          </>
        ) : (
          <h2>Logging you in...</h2>
        )}
      </div>
    </div>
  );
}
