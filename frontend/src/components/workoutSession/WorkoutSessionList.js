import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import WorkoutSessionForm from './WorkoutSessionForm';
import { pushNotification } from '../../store/slices/notificationSlice';
import workoutSessionService from '../../services/workoutSessionService';
import { Calendar, Play, Clock, ChevronLeft, ChevronRight, Activity, Trash2 } from 'lucide-react';

const WorkoutSessionList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const userRole = user?.role || '';
  const isUser = userRole === 'ROLE_USER' || userRole === 'USER';
  const isCoordinator =
    userRole === 'ROLE_PLATFORM_COORDINATOR' ||
    userRole === 'PLATFORM_COORDINATOR' ||
    userRole === 'ROLE_ADMIN' ||
    userRole === 'ADMIN';

  const [sessions, setSessions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTrackingSession, setActiveTrackingSession] = useState(null);

  const fetchSessionsData = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/sessions', { params: { page, size: 10 } });
      const data = res?.data;
      if (data && Array.isArray(data.content)) {
        setSessions(data.content);
        setTotalPages(data.totalPages !== undefined ? data.totalPages : 1);
        const active = data.content.find(
          (s) => s.sessionStatus === 'ACTIVE' || s.sessionStatus === 'IN_PROGRESS'
        );
        if (active) setActiveTrackingSession(active);
      } else if (Array.isArray(data)) {
        setSessions(data);
        setTotalPages(1);
        const active = data.find(
          (s) => s.sessionStatus === 'ACTIVE' || s.sessionStatus === 'IN_PROGRESS'
        );
        if (active) setActiveTrackingSession(active);
      } else {
        setSessions([]);
        setTotalPages(0);
      }
    } catch (err) {
      setSessions([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionsData(currentPage);
  }, [fetchSessionsData, currentPage]);

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'IN_PROGRESS') {
      return s.sessionStatus === 'IN_PROGRESS' || s.sessionStatus === 'ACTIVE';
    }
    return s.sessionStatus === statusFilter;
  });

  const getStatusBadge = (status) => {
    const norm = String(status || '').toUpperCase();
    if (norm === 'ACTIVE' || norm === 'IN_PROGRESS') {
      return <span className="badge badge-status-active">{norm}</span>;
    }
    if (norm === 'COMPLETED') {
      return <span className="badge badge-status-completed">COMPLETED</span>;
    }
    if (norm === 'CANCELLED') {
      return <span className="badge badge-status-cancelled">CANCELLED</span>;
    }
    return <span className="badge badge-status-default">{norm || 'LOGGED'}</span>;
  };

  const handleResumeSession = async (session) => {
    try {
      if (session.sessionStatus === 'COMPLETED') {
        const updated = await workoutSessionService.resumeSession(session.id);
        setActiveTrackingSession(updated);
        dispatch(
          pushNotification({
            message: 'Workout session resumed! Live tracking is active.',
            type: 'success',
          })
        );
        fetchSessionsData(currentPage);
      } else {
        setActiveTrackingSession(session);
        dispatch(
          pushNotification({
            message: 'Live workout tracking resumed.',
            type: 'info',
          })
        );
      }
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      dispatch(
        pushNotification({
          message:
            err.response?.data?.message || 'Failed to resume workout session',
          type: 'error',
        })
      );
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const confirmed = window.confirm(
      'Are you certain you want to permanently erase this workout session record?'
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      dispatch(
        pushNotification({
          message: 'Workout session record erased cleanly',
          type: 'success',
        })
      );
      if (activeTrackingSession?.id === sessionId) {
        setActiveTrackingSession(null);
      }
      fetchSessionsData(currentPage);
    } catch (err) {
      dispatch(
        pushNotification({
          message: 'Failed to erase workout session record',
          type: 'error',
        })
      );
    }
  };

  return (
    <div className="workout-sessions-page">
      {/* Active Session Live Tracker Banner if in progress or review */}
      {activeTrackingSession && (
        <div className="active-session-live-tracker mb-4">
          <WorkoutSessionForm
            key={`${activeTrackingSession.id}-${activeTrackingSession.sessionStatus}`}
            session={activeTrackingSession}
            onClose={() => setActiveTrackingSession(null)}
            onResumed={(updated) => {
              setActiveTrackingSession(updated);
              fetchSessionsData(currentPage);
            }}
            onCompleted={() => {
              setActiveTrackingSession(null);
              fetchSessionsData(currentPage);
            }}
          />
        </div>
      )}

      <div className="page-card">
        {/* Main Heading */}
        <div className="page-header-row mb-3">
          <div className="page-title-section">
            <div className="title-icon-badge">
              <Calendar size={22} className="text-accent" />
            </div>
            <div>
              <h1 className="page-title">Active Workouts & History</h1>
              <p className="page-subtitle">
                Inspect live workout session execution and browse historical training logs.
              </p>
            </div>
          </div>

          <div className="filter-tabs-group">
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              ALL
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'IN_PROGRESS' ? 'active' : ''}`}
              onClick={() => setStatusFilter('IN_PROGRESS')}
            >
              IN PROGRESS
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('COMPLETED')}
            >
              COMPLETED
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state-container p-4">
            <div className="loading-spinner" />
            <span>Syncing workout sessions history...</span>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="empty-state-card">
            <Clock size={40} className="empty-icon text-muted" />
            <p className="empty-message-text">No workout session logs found</p>
            <p className="text-muted text-sm">
              Initialize a blueprint from the Routines catalog to start logging your workouts.
            </p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="portal-data-table">
              <thead>
                <tr>
                  <th>SESSION ID / TAG</th>
                  <th>TRAINING BLUEPRINT</th>
                  <th>SCHEDULED DATE</th>
                  <th>EXECUTION STATUS</th>
                  <th>EFFECTIVE ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => {
                  const tagId = `SES-${String(session.id || 0).padStart(6, '0')}`;
                  const formattedDate = session.startTime
                    ? new Date(session.startTime).toLocaleDateString()
                    : 'Today';

                  return (
                    <tr key={session.id} className="session-data-row">
                      <td>
                        <span className="session-tag-id">{tagId}</span>
                      </td>
                      <td>
                        <strong className="session-blueprint-name">
                          {session.routineTitle || 'General Training Session'}
                        </strong>
                      </td>
                      <td>
                        <span className="session-date-text">{formattedDate}</span>
                      </td>
                      <td>
                        {/* Status text MUST be rendered in the DOM */}
                        <div className="session-status-wrapper">
                          {getStatusBadge(session.sessionStatus)}
                        </div>
                      </td>
                      <td>
                        <div className="action-button-group">
                          {isUser ? (
                            <button
                              type="button"
                              className="btn btn-action-inspect"
                              onClick={() => {
                                setActiveTrackingSession(session);
                                if (typeof window !== 'undefined') {
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                              }}
                              aria-label={`Inspect session ${session.id}`}
                              title="Review session logs"
                            >
                              <Activity size={13} className="btn-action-icon" />
                              Review
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="btn btn-action-init"
                                onClick={() => handleResumeSession(session)}
                                aria-label={`Resume session ${session.id}`}
                                title="Resume live workout tracking"
                              >
                                <Play size={13} className="btn-action-icon" />
                                Resume
                              </button>

                              {session.sessionStatus === 'COMPLETED' && (
                                <button
                                  type="button"
                                  className="btn btn-action-inspect"
                                  onClick={() => {
                                    setActiveTrackingSession(session);
                                    if (typeof window !== 'undefined') {
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                  }}
                                  aria-label={`Inspect session ${session.id}`}
                                  title="Review session logs"
                                >
                                  <Activity size={13} className="btn-action-icon" />
                                  Review
                                </button>
                              )}
                            </>
                          )}

                          {isCoordinator && (
                            <button
                              type="button"
                              className="btn btn-action-erase"
                              onClick={() => handleDeleteSession(session.id)}
                              aria-label={`Delete session ${session.id}`}
                              title="Permanently erase session"
                            >
                              <Trash2 size={13} className="btn-action-icon" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination-bar">
            <button
              type="button"
              className="btn btn-pagination"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-pagination"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutSessionList;
