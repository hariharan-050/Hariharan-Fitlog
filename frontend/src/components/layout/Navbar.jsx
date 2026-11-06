import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Activity, LogOut, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleClass = (role = '') => {
    const r = role.toUpperCase();
    if (r.includes('COORDINATOR') || r.includes('ADMIN')) return 'role-coordinator';
    if (r.includes('MEMBER')) return 'role-member';
    return 'role-user';
  };

  return (
    <nav className="fitlog-navbar" role="navigation">
      <div className="navbar-container">
        <div className="navbar-brand-section">
          <NavLink to="/" className="brand-link">
            <span className="brand-badge-icon">
              <Activity size={20} className="brand-logo-icon" />
            </span>
            <span className="brand-name">Fitlog Platform</span>
          </NavLink>
        </div>

        {isAuthenticated && (
          <div className="navbar-nav-links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'nav-item active-nav-item' : 'nav-item'
              }
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/routines"
              className={({ isActive }) =>
                isActive ? 'nav-item active-nav-item' : 'nav-item'
              }
            >
              Routines
            </NavLink>
            <NavLink
              to="/sessions"
              className={({ isActive }) =>
                isActive ? 'nav-item active-nav-item' : 'nav-item'
              }
            >
              Session Logs
            </NavLink>
            <NavLink
              to="/metrics"
              className={({ isActive }) =>
                isActive ? 'nav-item active-nav-item' : 'nav-item'
              }
            >
              Biometrics
            </NavLink>
          </div>
        )}

        <div className="navbar-actions-section">
          {isAuthenticated ? (
            <div className="user-profile-widget">
              <div className="user-meta-info">
                <span className="welcome-text">
                  Welcome back! <strong className="username-highlight">{user?.username || 'Member'}</strong>
                </span>
                {user?.role && (
                  <span className={`user-role-badge ${getRoleClass(user.role)}`}>
                    <ShieldCheck size={12} className="inline-role-icon" />
                    {user.role}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-logout"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut size={16} className="btn-icon" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
