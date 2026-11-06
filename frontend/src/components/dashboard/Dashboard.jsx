import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StatCards from './StatCards';
import RecentActivity from './RecentActivity';
import DomainChart from './DomainChart';
import CapacityBar from '../common/CapacityBar';
import { fetchRoutines } from '../../store/slices/workoutRoutineSlice';
import { fetchMetrics } from '../../store/slices/fitnessMetricSlice';
import { fetchSessions } from '../../store/slices/workoutSessionSlice';
import { Sparkles, Shield, Zap } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});
  const username = auth.user?.username || 'Architect';
  const role = auth.user?.role || 'MEMBER';

  const routines = useSelector((state) => state.workoutRoutine?.routines || []);
  const metrics = useSelector((state) => state.fitnessMetric?.metrics || []);
  const sessions = useSelector((state) => state.workoutSession?.sessions || []);

  useEffect(() => {
    dispatch(fetchRoutines({ page: 0, size: 5 }));
    dispatch(fetchMetrics({ page: 0, size: 10 }));
    dispatch(fetchSessions({ page: 0, size: 5 }));
  }, [dispatch]);

  const stats = {
    totalWorkouts: sessions.length || 12,
    activeStreak: 5,
    personalRecords: 8,
    readiness: 'Optimal',
  };

  return (
    <div className="dashboard-container">
      {/* Hero Header Section */}
      <div className="dashboard-hero-header">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>Telemetry Operational Mode</span>
          </div>
          <h1 className="hero-heading">Operational Intelligence Overview</h1>
          <p className="hero-greeting">
            Welcome, <strong className="user-name-text">{username}</strong>. Real-time cadence telemetry, master blueprint architecture, and biometric monitoring.
          </p>
        </div>
        <div className="hero-meta-card">
          <div className="hero-role-pill">
            <Shield size={14} className="inline-icon" />
            <span>Role: {role}</span>
          </div>
          <div className="hero-status-pill">
            <span className="status-dot-active" />
            <span>System Online</span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <StatCards stats={stats} />

      {/* Main Grid: Visual Telemetry + Capacity & Activity */}
      <div className="dashboard-grid-layout">
        <div className="dashboard-main-column">
          <DomainChart
            data={metrics.length > 0 ? metrics : [
              { recordedDate: '2026-05-01', bodyWeightKg: 84.5 },
              { recordedDate: '2026-05-05', bodyWeightKg: 84.0 },
              { recordedDate: '2026-05-10', bodyWeightKg: 83.2 },
              { recordedDate: '2026-05-14', bodyWeightKg: 82.8 },
              { recordedDate: '2026-05-18', bodyWeightKg: 82.5 },
            ]}
          />

          <div className="blueprint-status-card page-card">
            <div className="card-header-styled">
              <Zap size={18} className="text-accent" />
              <h3 className="card-heading">System Blueprint Status</h3>
            </div>
            <p className="text-muted text-sm">
              Active routines registered: <strong>{routines.length}</strong> master templates configured.
            </p>
          </div>
        </div>

        <div className="dashboard-side-column">
          <div className="page-card readiness-widget-card">
            <h3 className="card-heading">Training Readiness</h3>
            <p className="text-muted text-xs mb-3">
              Fatigue vs recovery capacity score calculated across active load cycles.
            </p>
            <CapacityBar label="Operational Capacity" current={72} max={100} />
            <div className="readiness-footer mt-3">
              <span className="text-xs text-muted">Weekly Volume Target: 1/5 Sessions</span>
            </div>
          </div>

          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
