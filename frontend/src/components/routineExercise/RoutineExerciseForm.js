import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExerciseToRoutineThunk } from '../../store/slices/routineExerciseSlice';
import { pushNotification } from '../../store/slices/notificationSlice';
import { Plus } from 'lucide-react';

const RoutineExerciseForm = ({ routineId, onExerciseAdded }) => {
  const dispatch = useDispatch();

  const [exerciseName, setExerciseName] = useState('');
  const [targetSets, setTargetSets] = useState(3);
  const [targetReps, setTargetReps] = useState(10);
  const [targetWeightKg, setTargetWeightKg] = useState(60);
  const [restDurationSeconds, setRestDurationSeconds] = useState(90);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    setLoading(true);
    const payload = {
      exerciseName: exerciseName.trim(),
      targetSets: Number(targetSets),
      targetReps: Number(targetReps),
      targetWeightKg: Number(targetWeightKg),
      restDurationSeconds: Number(restDurationSeconds),
    };

    try {
      if (routineId) {
        await dispatch(addExerciseToRoutineThunk({ routineId, exerciseData: payload })).unwrap();
        dispatch(
          pushNotification({
            message: 'Exercise added successfully',
            type: 'success',
          })
        );
      }
      setExerciseName('');
      if (onExerciseAdded) onExerciseAdded();
    } catch (err) {
      dispatch(
        pushNotification({
          message: 'Failed to add exercise',
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="routine-exercise-form">
      <div className="form-row-grid align-items-end">
        <div className="form-group flex-2">
          <label htmlFor="input-exerciseName" className="form-label text-xs">
            Exercise Name
          </label>
          <input
            id="input-exerciseName"
            type="text"
            className="form-control form-control-sm"
            placeholder="e.g. Incline Dumbbell Press"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="input-targetSets" className="form-label text-xs">
            Target Sets
          </label>
          <input
            id="input-targetSets"
            type="number"
            className="form-control form-control-sm"
            min={1}
            value={targetSets}
            onChange={(e) => setTargetSets(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="input-targetReps" className="form-label text-xs">
            Target Reps
          </label>
          <input
            id="input-targetReps"
            type="number"
            className="form-control form-control-sm"
            min={1}
            value={targetReps}
            onChange={(e) => setTargetReps(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="input-targetWeightKg" className="form-label text-xs">
            Target Weight (kg)
          </label>
          <input
            id="input-targetWeightKg"
            type="number"
            className="form-control form-control-sm"
            min={0}
            value={targetWeightKg}
            onChange={(e) => setTargetWeightKg(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="input-restDurationSeconds" className="form-label text-xs">
            Rest (s)
          </label>
          <input
            id="input-restDurationSeconds"
            type="number"
            className="form-control form-control-sm"
            min={0}
            value={restDurationSeconds}
            onChange={(e) => setRestDurationSeconds(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading}
          >
            <Plus size={14} className="btn-icon" />
            Add Exercise
          </button>
        </div>
      </div>
    </form>
  );
};

export default RoutineExerciseForm;
