import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createRoutine } from '../../services/workoutRoutineService';
import { pushNotification } from '../../store/slices/notificationSlice';
import { fetchRoutines } from '../../store/slices/workoutRoutineSlice';
import { X, Plus, Trash2, Dumbbell, Save } from 'lucide-react';

const WorkoutRoutineForm = ({ onClose }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetGoal, setTargetGoal] = useState('HYPERTROPHY');
  const [difficultyLevel, setDifficultyLevel] = useState('INTERMEDIATE');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [exercises, setExercises] = useState([
    {
      exerciseName: '',
      targetSets: 4,
      targetReps: 8,
      targetWeightKg: 0,
      restDurationSeconds: 90,
    },
  ]);

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExerciseRow = () => {
    setExercises([
      ...exercises,
      {
        exerciseName: '',
        targetSets: 3,
        targetReps: 10,
        targetWeightKg: 0,
        restDurationSeconds: 60,
      },
    ]);
  };

  const removeExerciseRow = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Client-side validation: must have title and primary exercise
    if (!title || !title.trim()) {
      setErrorMsg('Routine Blueprint Title is strictly mandatory.');
      return;
    }

    const firstExerciseName = exercises[0]?.exerciseName;
    if (!firstExerciseName || !firstExerciseName.trim()) {
      setErrorMsg('Primary exercise definition is required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const payload = {
      title: title.trim(),
      description: description.trim(),
      targetGoal,
      difficultyLevel,
      exercises: exercises.map((ex, idx) => ({
        ...ex,
        exerciseOrder: idx + 1,
      })),
    };

    try {
      await createRoutine(payload);
      dispatch(
        pushNotification({
          message: 'Blueprint seeded successfully',
          type: 'success',
        })
      );
      dispatch(fetchRoutines({ page: 0, size: 10 }));
      if (onClose) onClose();
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          msg = 'Session expired or unauthorized. Please click Logout and log back in as admin_core.';
        } else {
          msg = 'Failed to save master routine blueprint.';
        }
      }
      setErrorMsg(msg);
      dispatch(
        pushNotification({
          message: msg,
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-overlay" role="dialog" aria-modal="true">
      <div className="modal-dialog-container modal-lg">
        <div className="modal-header">
          <div className="modal-header-title-group">
            <Dumbbell className="modal-title-icon text-accent" size={22} />
            <h2 className="modal-title">Seed Training Blueprint</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="form-alert-error" role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="routine-builder-form">
          <div className="form-group mb-3">
            <label htmlFor="routine-title" className="form-label">
              Routine Blueprint Title <span className="text-danger">*</span>
            </label>
            <input
              id="routine-title"
              type="text"
              className="form-control"
              placeholder="e.g. Upper Body Hypertrophy Surge"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="routine-desc" className="form-label">
              Overview Summary Description
            </label>
            <textarea
              id="routine-desc"
              className="form-control textarea-input"
              rows={2}
              placeholder="Briefly describe the physiological focus of this blueprint..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row-grid mb-4">
            <div className="form-group">
              <label htmlFor="routine-goal" className="form-label">
                Target Body Outcome
              </label>
              <select
                id="routine-goal"
                className="form-control"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
              >
                <option value="HYPERTROPHY">HYPERTROPHY</option>
                <option value="STRENGTH">STRENGTH</option>
                <option value="ENDURANCE">ENDURANCE</option>
                <option value="POWERLIFTING">POWERLIFTING</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="routine-diff" className="form-label">
                Intensity Difficulty Rating
              </label>
              <select
                id="routine-diff"
                className="form-control"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>
          </div>

          {/* Sub Exercises Table */}
          <div className="sub-exercises-section mb-4">
            <div className="section-label-heading">CONFIGURE INTERNAL TARGET SETS</div>
            <div className="sub-exercises-table-wrapper">
              <table className="sub-exercises-table">
                <thead>
                  <tr>
                    <th>Exercise Name <span className="text-danger">*</span></th>
                    <th style={{ width: '80px' }}>Sets</th>
                    <th style={{ width: '80px' }}>Reps</th>
                    <th style={{ width: '90px' }}>Weight (kg)</th>
                    <th style={{ width: '90px' }}>Rest (s)</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.map((ex, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Barbell Squat"
                          value={ex.exerciseName}
                          onChange={(e) =>
                            handleExerciseChange(idx, 'exerciseName', e.target.value)
                          }
                          required
                          aria-label={`Exercise Name ${idx + 1}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={ex.targetSets}
                          min={1}
                          onChange={(e) =>
                            handleExerciseChange(idx, 'targetSets', Number(e.target.value))
                          }
                          aria-label={`Sets ${idx + 1}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={ex.targetReps}
                          min={1}
                          onChange={(e) =>
                            handleExerciseChange(idx, 'targetReps', Number(e.target.value))
                          }
                          aria-label={`Reps ${idx + 1}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={ex.targetWeightKg}
                          min={0}
                          onChange={(e) =>
                            handleExerciseChange(idx, 'targetWeightKg', Number(e.target.value))
                          }
                          aria-label={`Weight ${idx + 1}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={ex.restDurationSeconds}
                          min={0}
                          onChange={(e) =>
                            handleExerciseChange(idx, 'restDurationSeconds', Number(e.target.value))
                          }
                          aria-label={`Rest ${idx + 1}`}
                        />
                      </td>
                      <td>
                        {exercises.length > 1 && (
                          <button
                            type="button"
                            className="btn-icon-danger"
                            onClick={() => removeExerciseRow(idx)}
                            aria-label={`Remove exercise ${idx + 1}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mt-2"
              onClick={addExerciseRow}
            >
              <Plus size={14} className="btn-icon" />
              Add Sub-Exercise
            </button>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} className="btn-icon" />
              {loading ? 'Saving...' : 'Save Master Routine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutRoutineForm;
