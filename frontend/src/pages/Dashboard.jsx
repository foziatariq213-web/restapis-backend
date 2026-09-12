import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [params] = useSearchParams();
  // Email verification link ke baad backend yahan ?verified=1 ke saath redirect karta hai
  const justVerified = params.get('verified') === '1';

  return (
    <div className="page">
      <div className="card">
        <h2>Dashboard 🔐</h2>
        {justVerified && <div className="alert success">Email verify ho gaya ✔ Mubarak ho!</div>}
        <p className="muted">
          Yeh protected page hai — data <code>GET /api/user</code> se aaya hai (Bearer token ke
          saath). Yeh route Laravel mein already bana hua hai.
        </p>

        {user ? (
          <table className="table">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{user.id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{user.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Email verified</th>
                <td>
                  {user.email_verified_at ? (
                    <>✔ {user.email_verified_at}</>
                  ) : (
                    <>
                      ✖ Nahi — <Link to="/verify-email">verify karo</Link>
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <th>Created</th>
                <td>{user.created_at}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="muted">Loading user...</p>
        )}

        <div className="card inner">
          <h4>Aap ka Sanctum token (localStorage mein saved)</h4>
          <code className="token">{token ? `${token.slice(0, 30)}...` : '—'}</code>
          <p className="muted small">
            Har API request ke saath yeh <code>Authorization: Bearer &lt;token&gt;</code> header mein
            jaata hai — <code>src/api/client.js</code> ka interceptor dekho.
          </p>
        </div>

        <button className="btn btn-danger" onClick={logout}>
          Logout (POST /api/logout)
        </button>
      </div>
    </div>
  );
}
