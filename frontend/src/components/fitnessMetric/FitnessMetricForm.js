import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMetric } from '../../services/fitnessMetricService';
import { pushNotification } from '../../store/slices/notificationSlice';
import { HeartPulse, X, Save } from 'lucide-react';

const FitnessMetricForm = ({ onClose, onSaved }) => {
  const dispatch = useDispatch();

  const todayStr = new Date().toISOString().substring(0, 10);

  const [recordedDate, setRecordedDate] = useState(todayStr);
  const [bodyWeightKg, setBodyWeightKg] = useState('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState('');
  const [chestCircumferenceCm, setChestCircumferenceCm] = useState('');
  const [waistCircumferenceCm, setWaistCircumferenceCm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!bodyWeightKg) {
      setErrorMsg('Body Mass is required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const payload = {
      recordedDate: recordedDate || todayStr,
      bodyWeightKg: parseFloat(bodyWeightKg),
      bodyFatPercentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : null,
      chestCircumferenceCm: chestCircumferenceCm ? parseFloat(chestCircumferenceCm) : null,
      waistCircumferenceCm: waistCircumferenceCm ? parseFloat(waistCircumferenceCm) : null,
    };

    try {
      await addMetric(payload);
      dispatch(
        pushNotification({
          message: 'Biometric telemetry seeded successfully',
          type: 'success',
        })
      );
      if (onSaved) onSaved();
      if (onClose) onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to persist biometric metrics';
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
      <div className="modal-dialog-container modal-md">
        <div className="modal-header">
          <div className="modal-header-title-group">
            <HeartPulse className="modal-title-icon text-accent" size={22} />
            <h2 className="modal-title">Seed Biometric Data</h2>
          </div>
          {onClose && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="form-alert-error" role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="biometric-entry-form">
          <div className="form-group mb-3">
            <label htmlFor="capture-date" className="form-label">
              Capture Date <span className="text-danger">*</span>
            </label>
            <input
              id="capture-date"
              type="date"
              className="form-control"
              value={recordedDate}
              onChange={(e) => setRecordedDate(e.target.value)}
              required
            />
          </div>

          <div className="form-row-grid mb-3">
            <div className="form-group">
              <label htmlFor="body-mass" className="form-label">
                Body Mass (kg) <span className="text-danger">*</span>
              </label>
              <input
                id="body-mass"
                type="number"
                step="0.1"
                className="form-control"
                placeholder="75"
                value={bodyWeightKg}
                onChange={(e) => setBodyWeightKg(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="body-fat" className="form-label">
                Body Fat (%)
              </label>
              <input
                id="body-fat"
                type="number"
                step="0.1"
                className="form-control"
                placeholder="Optional"
                value={bodyFatPercentage}
                onChange={(e) => setBodyFatPercentage(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-grid mb-4">
            <div className="form-group">
              <label htmlFor="chest-cm" className="form-label">
                Chest (cm)
              </label>
              <input
                id="chest-cm"
                type="number"
                step="0.5"
                className="form-control"
                placeholder="Optional"
                value={chestCircumferenceCm}
                onChange={(e) => setChestCircumferenceCm(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="waist-cm" className="form-label">
                Waist (cm)
              </label>
              <input
                id="waist-cm"
                type="number"
                step="0.5"
                className="form-control"
                placeholder="Optional"
                value={waistCircumferenceCm}
                onChange={(e) => setWaistCircumferenceCm(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            {onClose && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} className="btn-icon" />
              {loading ? 'Saving...' : 'Save Metrics'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FitnessMetricForm;
