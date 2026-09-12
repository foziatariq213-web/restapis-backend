import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Jis page ko login ke baghair nahi dikhana, usse is component mein wrap karo
export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (loading) return <p className="center muted">Loading...</p>;

  return children;
}
