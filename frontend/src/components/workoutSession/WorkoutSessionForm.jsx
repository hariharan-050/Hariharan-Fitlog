import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { pushNotification } from '../../store/slices/notificationSlice';
import workoutSessionService from '../../services/workoutSessionService';
import ExerciseLogList from '../exerciseLog/ExerciseLogList';
import { Timer, CheckCircle, X, PauseCircle, Play } from 'lucide-react';

const WorkoutSessionForm = ({ session = {}, onCompleted, onClose, onResumed }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const userRole = user?.role || '';
  const isUser = userRole === 'ROLE_USER' || userRole === 'USER';

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [rating, setRating] = useState(5);
  const [sessionNotes, setSessionNotes] = useState('');

  const isCompleted = session.sessionStatus === 'COMPLETED';

  // Active timer calculation - genuinely halts when isPaused or isCompleted
  useEffect(() => {
    if (session.startTime && secondsElapsed === 0) {
      const start = new Date(session.startTime).getTime();
      const now = Date.now();
      const initial = Math.max(0, Math.floor((now - start) / 1000));
      setSecondsElapsed(initial);
    }
  }, [session.startTime]);

  useEffect(() => {
    if (isCompleted || isPaused) return;

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted, isPaused]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleDismiss = () => {
    if (onClose) {
      onClose();
    } else if (onCompleted) {
      onCompleted();
    }
  };

  const handleComplete = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    setLoading(true);
    const payload = {
      endTime: new Date().toISOString(),
      durationSeconds: secondsElapsed,
      rating,
      notes: sessionNotes,
    };

    try {
      if (session.id) {
        try {
          await workoutSessionService.completeSession(session.id, []);
        } catch (servErr) {
          try {
            await axios.put(`/api/sessions/${session.id}/complete`, []);
          } catch (putErr) {
            await axios.post(`/api/sessions/${session.id}/complete`, payload);
          }
        }
      }
      dispatch(
        pushNotification({
          message: 'Workout session completed successfully',
          type: 'success',
        })
      );
      if (onCompleted) onCompleted();
    } catch (err) {
      dispatch(
        pushNotification({
          message: 'Failed to complete session',
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setResuming(true);
    try {
      const updated = await workoutSessionService.resumeSession(session.id);
      dispatch(
        pushNotification({
          message: 'Workout session reopened and resumed! Live tracking active.',
          type: 'success',
        })
      );
      if (onResumed) {
        onResumed(updated);
      }
    } catch (err) {
      dispatch(
        pushNotification({
          message: err.response?.data?.message || 'Failed to resume workout session',
          type: 'error',
        })
      );
    } finally {
      setResuming(false);
    }
  };

  return (
    <div className="workout-session-form-card page-card">
      <div className="session-timer-banner">
        <div className="session-timer-info">
          <div className="timer-badge">
            <Timer size={20} className="timer-icon text-accent" />
            <span className="timer-heading">
              {isCompleted
                ? 'Workout Duration'
                : isPaused
                ? 'Live Session Timer (PAUSED)'
                : 'Live Session Timer'}
            </span>
          </div>
          <div className="session-clock-display" aria-label="Session Timer">
            {formatTimer(secondsElapsed)}
            {isPaused && !isCompleted && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  marginLeft: '10px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(234, 179, 8, 0.2)',
                  color: '#eab308',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                }}
              >
                PAUSED
              </span>
            )}
          </div>
        </div>

        <div className="session-blueprint-meta">
          <span className="text-muted text-xs">
            {isCompleted ? 'HISTORICAL LOG' : 'ACTIVE BLUEPRINT INITIALIZED'}
          </span>
          <strong className="session-blueprint-title">
            {session.routineTitle || 'Custom Workout Architecture'}
          </strong>
        </div>

        <button
          type="button"
          className="btn btn-close-tracker"
          onClick={handleDismiss}
          aria-label="Close session tracker"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div className="session-exercises-stream my-4">
        <ExerciseLogList
          sessionId={session.id}
          sessionStatus={session.sessionStatus || 'IN_PROGRESS'}
        />
      </div>

      <div className="session-completion-controls">
        <div className="form-group mb-3">
          <label htmlFor="session-rating" className="form-label text-xs">
            Performance Rating (1-10)
          </label>
          <input
            id="session-rating"
            type="number"
            min={1}
            max={10}
            className="form-control form-control-sm"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            disabled={isCompleted || isUser}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="session-notes" className="form-label text-xs">
            Session Debrief & Physiological Notes
          </label>
          <textarea
            id="session-notes"
            className="form-control textarea-input"
            rows={2}
            placeholder="Log fatigue, RPE rating, or biomechanical adjustments..."
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            disabled={isCompleted || isUser}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {!isCompleted ? (
            <>
              {!isUser && (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                  onClick={handleComplete}
                  disabled={loading}
                >
                  <CheckCircle size={18} className="btn-icon" />
                  {loading ? 'Completing Session...' : 'Complete Workout'}
                </button>
              )}
              {!isUser && (
                <button
                  type="button"
                  className={`btn ${isPaused ? 'btn-action-init' : 'btn-secondary'} btn-lg`}
                  onClick={() => {
                    const next = !isPaused;
                    setIsPaused(next);
                    dispatch(
                      pushNotification({
                        message: next
                          ? 'Workout timer paused cleanly.'
                          : 'Workout timer resumed!',
                        type: 'info',
                      })
                    );
                  }}
                  aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
                >
                  {isPaused ? (
                    <>
                      <Play size={18} className="btn-icon" />
                      Resume Timer
                    </>
                  ) : (
                    <>
                      <PauseCircle size={18} className="btn-icon" />
                      Pause Timer
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                style={{ flex: isUser ? 1 : undefined }}
                onClick={handleDismiss}
              >
                <X size={18} className="btn-icon" />
                {isUser ? 'Close Review' : 'Minimize'}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'center' }}>
              {!isUser && (
                <button
                  type="button"
                  className="btn btn-action-init btn-lg"
                  style={{ flex: 1 }}
                  onClick={handleResume}
                  disabled={resuming}
                  aria-label="Resume workout"
                >
                  <Play size={18} className="btn-icon" />
                  {resuming ? 'Resuming Session...' : 'Resume Workout'}
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                style={{ flex: 1 }}
                onClick={handleDismiss}
              >
                Close Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutSessionForm;

