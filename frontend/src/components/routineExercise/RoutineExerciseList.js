import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import RoutineExerciseForm from './RoutineExerciseForm';
import { pushNotification } from '../../store/slices/notificationSlice';
import { Dumbbell, Trash2, ListFilter } from 'lucide-react';

const RoutineExerciseList = ({ routineId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { selectedRoutine } = useSelector((state) => state.workoutRoutine || {});
  const userRole = user?.role || '';
  const isCoordinator =
    userRole === 'ROLE_PLATFORM_COORDINATOR' ||
    userRole === 'PLATFORM_COORDINATOR' ||
    userRole === 'ROLE_ADMIN' ||
    userRole === 'ADMIN';
  const isAuthor = Boolean(selectedRoutine?.authorName && user?.username && selectedRoutine.authorName.toLowerCase() === user.username.toLowerCase());
  const canModify = isCoordinator || isAuthor || !userRole;

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExercises = useCallback(async () => {
    if (!routineId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/exercises/routine/${routineId}`);
      const data = res?.data;
      if (Array.isArray(data)) {
        setExercises(data.sort((a, b) => (a.exerciseOrder || 0) - (b.exerciseOrder || 0)));
      } else if (data?.content && Array.isArray(data.content)) {
        setExercises(data.content.sort((a, b) => (a.exerciseOrder || 0) - (b.exerciseOrder || 0)));
      } else {
        setExercises([]);
      }
    } catch (err) {
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [routineId]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleDelete = async (exerciseId) => {
    const confirmed = window.confirm(
      'Are you sure you want to remove this exercise from the blueprint?'
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/exercises/${exerciseId}`);
      dispatch(
        pushNotification({
          message: 'Exercise record erased',
          type: 'success',
        })
      );
      setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
    } catch (err) {
      dispatch(
        pushNotification({
          message: 'Failed to erase exercise record',
          type: 'error',
        })
      );
    }
  };

  return (
    <div className="routine-exercises-container">
      <div className="routine-exercises-header mb-3">
        <div className="d-flex align-items-center gap-2">
          <ListFilter size={18} className="text-accent" />
          <h3 className="section-title">Configured Exercise Movements</h3>
        </div>
      </div>

      {canModify && (
        <div className="routine-exercise-form-card mb-4">
          <RoutineExerciseForm routineId={routineId} onExerciseAdded={fetchExercises} />
        </div>
      )}

      {loading ? (
        <div className="loading-state-container p-3">
          <div className="loading-spinner" />
          <span>Loading exercises...</span>
        </div>
      ) : exercises.length === 0 ? (
        <div className="empty-exercise-box">
          <Dumbbell size={32} className="text-muted mb-2" />
          <p className="text-muted">No exercises configured for this blueprint yet.</p>
        </div>
      ) : (
        <div className="table-responsive-container">
          <table className="portal-data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>EXERCISE NAME</th>
                <th>TARGET SETS</th>
                <th>TARGET REPS</th>
                <th>TARGET LOAD</th>
                <th>REST PERIOD</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex, idx) => (
                <tr key={ex.id || idx}>
                  <td>{ex.exerciseOrder || idx + 1}</td>
                  <td>
                    <strong className="exercise-title-text">{ex.exerciseName}</strong>
                  </td>
                  <td>{ex.targetSets} sets</td>
                  <td>{ex.targetReps} reps</td>
                  <td>{ex.targetWeightKg} kg</td>
                  <td>{ex.restDurationSeconds || 60}s</td>
                  <td>
                    {canModify ? (
                      <button
                        type="button"
                        className="btn btn-action-erase"
                        onClick={() => handleDelete(ex.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} className="btn-action-icon" />
                        Remove item
                      </button>
                    ) : (
                      <span className="text-muted text-xs">Read-only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RoutineExerciseList;
