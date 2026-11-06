import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import FitnessMetricForm from './FitnessMetricForm';
import { pushNotification } from '../../store/slices/notificationSlice';
import { HeartPulse, Plus, Trash2, ChevronLeft, ChevronRight, Scale } from 'lucide-react';

const FitnessMetricList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const userRole = user?.role || '';
  const isCoordinator =
    userRole === 'ROLE_PLATFORM_COORDINATOR' ||
    userRole === 'PLATFORM_COORDINATOR' ||
    userRole === 'ROLE_ADMIN' ||
    userRole === 'ADMIN';
  const isUser = userRole === 'ROLE_USER' || userRole === 'USER';
  const isMember = userRole === 'ROLE_MEMBER' || userRole === 'MEMBER';
  const canDelete = (isCoordinator || !userRole) && !isMember && !isUser;

  const [metrics, setMetrics] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchMetricsData = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/metrics', { params: { page, size: 10 } });
      const data = res?.data;
      if (data && Array.isArray(data.content)) {
        setMetrics(data.content);
        setTotalPages(data.totalPages !== undefined ? data.totalPages : 1);
      } else if (Array.isArray(data)) {
        setMetrics(data);
        setTotalPages(1);
      } else {
        setMetrics([]);
        setTotalPages(0);
      }
    } catch (err) {
      setMetrics([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetricsData(currentPage);
  }, [fetchMetricsData, currentPage]);

  const handleDelete = async (metricId) => {
    const confirmed = window.confirm(
      'Are you certain you want to permanently erase this biometric telemetry record?'
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/metrics/${metricId}`);
      dispatch(
        pushNotification({
          message: 'Metric trace erased cleanly',
          type: 'success',
        })
      );
      fetchMetricsData(currentPage);
    } catch (err) {
      dispatch(
        pushNotification({
          message: 'Failed to erase biometric record',
          type: 'error',
        })
      );
    }
  };

  return (
    <div className="fitness-metrics-page page-card">
      <div className="page-header-row mb-3">
        <div className="page-title-section">
          <div className="title-icon-badge">
            <HeartPulse size={22} className="text-accent" />
          </div>
          <div>
            <h1 className="page-title">Biometric Progress Hub</h1>
            <p className="page-subtitle">
              Record daily structural weight masses, body fat percentages, and physical measurements to track performance over cycles.
            </p>
          </div>
        </div>

        {!isUser && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowFormModal(true)}
          >
            <Plus size={16} className="btn-icon" />
            Seed Biometric Data
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state-container p-4">
          <div className="loading-spinner" />
          <span>Syncing biometric telemetry...</span>
        </div>
      ) : metrics.length === 0 ? (
        <div className="empty-state-card">
          <Scale size={40} className="empty-icon text-muted" />
          <p className="empty-message-text">No biometric records matched</p>
          <p className="text-muted text-sm">
            Click 'Seed Biometric Data' above to capture your initial telemetry point.
          </p>
        </div>
      ) : (
        <div className="table-responsive-container">
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>CAPTURE DATE</th>
                <th>BODY MASS (KG)</th>
                <th>BODY FAT (%)</th>
                <th>CHEST (CM)</th>
                <th>WAIST (CM)</th>
                <th>EFFECTIVE ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((item) => (
                <tr key={item.id} className="metric-row">
                  <td>
                    <span className="metric-date-badge">{item.recordedDate}</span>
                  </td>
                  <td>
                    <strong className="metric-weight-value">
                      {item.bodyWeightKg !== undefined && item.bodyWeightKg !== null
                        ? `${item.bodyWeightKg} kg`
                        : '--'}
                    </strong>
                  </td>
                  <td>
                    {item.bodyFatPercentage !== undefined && item.bodyFatPercentage !== null
                      ? `${item.bodyFatPercentage}%`
                      : '--'}
                  </td>
                  <td>
                    {item.chestCircumferenceCm !== undefined && item.chestCircumferenceCm !== null
                      ? `${item.chestCircumferenceCm} cm`
                      : '--'}
                  </td>
                  <td>
                    {item.waistCircumferenceCm !== undefined && item.waistCircumferenceCm !== null
                      ? `${item.waistCircumferenceCm} cm`
                      : '--'}
                  </td>
                  <td>
                    {canDelete ? (
                      <button
                        type="button"
                        className="btn btn-action-erase"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Erase"
                      >
                        <Trash2 size={13} className="btn-action-icon" />
                        Erase
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

      {showFormModal && (
        <FitnessMetricForm
          onClose={() => setShowFormModal(false)}
          onSaved={() => {
            setShowFormModal(false);
            fetchMetricsData(currentPage);
          }}
        />
      )}
    </div>
  );
};

export default FitnessMetricList;
