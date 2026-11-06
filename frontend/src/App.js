import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import NotificationStack from './components/NotificationStack';
import ErrorHandler from './components/ErrorHandler';
import Login from './components/Login';
import Dashboard from './components/dashboard/Dashboard';
import WorkoutRoutineList from './components/workoutRoutine/WorkoutRoutineList';
import WorkoutSessionList from './components/workoutSession/WorkoutSessionList';
import FitnessMetricList from './components/fitnessMetric/FitnessMetricList';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ErrorHandler>
      <Router>
        <div className="fitlog-app-root">
          <Navbar />
          <NotificationStack />
          <main className="main-content-viewport">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/routines"
                element={
                  <ProtectedRoute>
                    <WorkoutRoutineList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sessions"
                element={
                  <ProtectedRoute>
                    <WorkoutSessionList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/metrics"
                element={
                  <ProtectedRoute>
                    <FitnessMetricList />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorHandler>
  );
}

export default App;
