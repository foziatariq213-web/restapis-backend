import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Rest<span>APIs</span> Practice
      </Link>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        {token && <NavLink to="/dashboard">Dashboard</NavLink>}
      </div>

      <div className="nav-auth">
        {token ? (
          <>
            <span className="nav-user">👋 {user?.name ?? '...'}</span>
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
