import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Teams from './pages/Teams';
import Leaderboard from './pages/Leaderboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token by fetching user profile
      fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(async (res) => {
          const data = await res.json();
          
          if (res.status === 401) {
            // Token is invalid or expired
            console.log('Token invalid, clearing storage');
            localStorage.removeItem('token');
            setLoading(false);
            return;
          }
          
          if (data.user) {
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Token verification error:', err);
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navigation isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register onRegister={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/activities"
            element={isAuthenticated ? <Activities /> : <Navigate to="/login" />}
          />
          <Route path="/teams" element={<Teams isAuthenticated={isAuthenticated} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
