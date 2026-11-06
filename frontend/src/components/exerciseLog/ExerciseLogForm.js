import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { pushNotification } from '../../store/slices/notificationSlice';
import { Save } from 'lucide-react';

const ExerciseLogForm = ({ log = {}, onSaved }) => {
  const dispatch = useDispatch();

  const [actualSets, setActualSets] = useState(log.actualSets || 0);
  const [actualReps, setActualReps] = useState(log.actualReps || 0);
  const [actualWeightKg, setActualWeightKg] = useState(log.actualWeightKg || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    setLoading(true);
    const payload = {
      actualSets: Number(actualSets),
      actualReps: Number(actualReps),
      actualWeightKg: Number(actualWeightKg),
    };

    try {
      if (log.id) {
        await axios.put(`/api/logs/${log.id}`, payload);
      }
      dispatch(
        pushNotification({
          message: 'Exercise performance metrics logged cleanly',
          type: 'success',
        })
      );
      if (onSaved) onSaved();
    } catch (err) {
      dispatch(
        pushNotification({
          message: 'Failed to update performance log',
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="exercise-log-form">
      <div className="log-form-grid">
        <div className="log-form-field">
          <label htmlFor={`sets-${log.id || 'new'}`} className="log-field-label">
            Sets
          </label>
          <input
            id={`sets-${log.id || 'new'}`}
            type="number"
            className="form-control form-control-sm"
            value={actualSets}
            min={0}
            onChange={(e) => setActualSets(e.target.value)}
            aria-label="actualSets"
          />
        </div>

        <div className="log-form-field">
          <label htmlFor={`reps-${log.id || 'new'}`} className="log-field-label">
            Reps
          </label>
          <input
            id={`reps-${log.id || 'new'}`}
            type="number"
            className="form-control form-control-sm"
            value={actualReps}
            min={0}
            onChange={(e) => setActualReps(e.target.value)}
            aria-label="actualReps"
          />
        </div>

        <div className="log-form-field">
          <label htmlFor={`weight-${log.id || 'new'}`} className="log-field-label">
            Weight (kg)
          </label>
          <input
            id={`weight-${log.id || 'new'}`}
            type="number"
            className="form-control form-control-sm"
            value={actualWeightKg}
            min={0}
            onChange={(e) => setActualWeightKg(e.target.value)}
            aria-label="actualWeightKg"
          />
        </div>

        <div className="log-form-action">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading}
          >
            <Save size={13} className="btn-icon" />
            Save Log
          </button>
        </div>
      </div>
    </form>
  );
};

export default ExerciseLogForm;
