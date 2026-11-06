import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ExerciseLogForm from './ExerciseLogForm';
import { Dumbbell, Target, CheckCircle } from 'lucide-react';

const ExerciseLogList = ({ sessionId, sessionStatus = 'IN_PROGRESS' }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/logs/session/${sessionId}`);
      const data = res?.data;
      if (Array.isArray(data)) {
        setLogs(data);
      } else if (data?.content && Array.isArray(data.content)) {
        setLogs(data.content);
      } else {
        setLogs([]);
      }
    } catch (err) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const isInteractive =
    sessionStatus === 'IN_PROGRESS' || sessionStatus === 'ACTIVE';

  return (
    <div className="exercise-log-list-container">
      <div className="log-list-header mb-3">
        <h4 className="log-list-title">Session Performance Telemetry</h4>
        <span className="text-muted text-xs">
          Target parameters vs Recorded actual performance
        </span>
      </div>

      {loading ? (
        <div className="loading-state-container p-3">
          <div className="loading-spinner" />
          <span>Fetching session logs...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="empty-exercise-box">
          <Dumbbell size={28} className="text-muted mb-2" />
          <p className="text-muted">No exercise telemetry recorded for this session.</p>
        </div>
      ) : (
        <div className="log-entries-stack">
          {logs.map((log) => (
            <div key={log.id} className="exercise-log-card">
              <div className="log-card-header">
                <div className="log-title-group">
                  <Dumbbell size={16} className="text-accent" />
                  <strong className="log-exercise-name">
                    {log.exerciseName || 'Exercise Movement'}
                  </strong>
                </div>
                <div className="log-target-comparison">
                  <span className="target-pill">
                    <Target size={12} className="inline-icon" />
                    Target: {log.targetSets || 3} sets × {log.targetReps || 10} reps @ {log.targetWeightKg || 0} kg
                  </span>
                  {!isInteractive && (
                    <span className="actual-pill">
                      <CheckCircle size={12} className="inline-icon" />
                      Actual: {log.actualSets || 0} sets × {log.actualReps || 0} reps @ {log.actualWeightKg || 0} kg
                    </span>
                  )}
                </div>
              </div>

              {isInteractive && (
                <div className="log-form-wrapper mt-3">
                  <ExerciseLogForm log={log} onSaved={fetchLogs} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseLogList;
