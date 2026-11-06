import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchFilterBar from '../common/SearchFilterBar';
import WorkoutRoutineForm from './WorkoutRoutineForm';
import RoutineExerciseList from '../routineExercise/RoutineExerciseList';
import { setSelectedRoutine } from '../../store/slices/workoutRoutineSlice';
import { pushNotification } from '../../store/slices/notificationSlice';
import { startSession } from '../../services/workoutSessionService';
import {
  Plus,
  Dumbbell,
  Eye,
  Play,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

const WorkoutRoutineList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth || {});
  const userRole = user?.role || '';
  const isCoordinator =
    userRole === 'ROLE_PLATFORM_COORDINATOR' ||
    userRole === 'PLATFORM_COORDINATOR' ||
    userRole === 'ROLE_ADMIN' ||
    userRole === 'ADMIN';
  const isUser = userRole === 'ROLE_USER' || userRole === 'USER';
  const canCreateBlueprint = isCoordinator || !userRole;

  const [routines, setRoutines] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGoal, setFilterGoal] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [inspectingRoutine, setInspectingRoutine] = useState(null);

  const fetchRoutinesData = useCallback(
    async (page = 0, query = '', goal = '') => {
      setLoading(true);
      try {
        const params = { page, size: 10 };
        if (query) params.query = query;
        if (goal) params.goal = goal;

        const res = await axios.get('/api/routines', { params });
        const data = res?.data;
        if (data && Array.isArray(data.content)) {
          setRoutines(data.content);
          setTotalPages(data.totalPages !== undefined ? data.totalPages : 1);
        } else if (Array.isArray(data)) {
          setRoutines(data);
          setTotalPages(1);
        } else {
          setRoutines([]);
          setTotalPages(0);
        }
      } catch (err) {
        setRoutines([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRoutinesData(currentPage, searchQuery, filterGoal);
  }, [fetchRoutinesData, currentPage, searchQuery, filterGoal]);

  const handleSearch = ({ query, goal }) => {
    setSearchQuery(query);
    setFilterGoal(goal);
    setCurrentPage(0);
    fetchRoutinesData(0, query, goal);
  };

  const handleGoalFilter = (goal) => {
    setFilterGoal(goal);
    setCurrentPage(0);
    fetchRoutinesData(0, searchQuery, goal);
  };

  const handleDelete = async (routineId) => {
    const confirmed = window.confirm(
      'Are you certain you want to permanently erase this routine blueprint?'
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/routines/${routineId}`);
      dispatch(
        pushNotification({
          message: 'Routine blueprint erased cleanly',
          type: 'success',
        })
      );
      // Refresh current page
      fetchRoutinesData(currentPage, searchQuery, filterGoal);
    } catch (err) {
      dispatch(
        pushNotification({
          message: 'Failed to erase routine blueprint',
          type: 'error',
        })
      );
    }
  };

  const handleInspect = (routine) => {
    dispatch(setSelectedRoutine(routine));
    setInspectingRoutine(routine);
  };

  const handleInitializeSession = async (routine) => {
    try {
      await startSession({
        routineId: routine.id,
        routineTitle: routine.title,
      });
      dispatch(
        pushNotification({
          message: `Active workout session initialized for ${routine.title}`,
          type: 'success',
        })
      );
      navigate('/sessions');
    } catch (err) {
      navigate('/sessions');
    }
  };

  return (
    <div className="workout-routines-page">
      <div className="page-card">
        {/* Header with Title and Primary Action */}
        <div className="page-header-row">
          <div className="page-title-section">
            <div className="title-icon-badge">
              <Dumbbell size={22} className="text-accent" />
            </div>
            <div>
              <h1 className="page-title">Workout Routine Master Log</h1>
              <p className="page-subtitle">
                Architect, catalog, and initialize standardized training blueprints.
              </p>
            </div>
          </div>
          {canCreateBlueprint && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} className="btn-icon" />
              Seed Training Blueprint
            </button>
          )}
        </div>

        {/* Search and Filtering */}
        <SearchFilterBar
          onSearch={handleSearch}
          onFilterGoal={handleGoalFilter}
          currentGoal={filterGoal}
          loading={loading}
          initialQuery={searchQuery}
        />

        {/* Loading Text */}
        {loading && (
          <div className="loading-state-container" role="status">
            <div className="loading-spinner" />
            <span className="loading-text">Syncing catalog data...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && routines.length === 0 && (
          <div className="empty-state-card">
            <Layers size={40} className="empty-icon text-muted" />
            <p className="empty-message-text">No routine assets found</p>
            <p className="text-muted text-sm">
              Click 'Seed Training Blueprint' above to register your first routine.
            </p>
          </div>
        )}

        {/* Routines Table */}
        {!loading && routines.length > 0 && (
          <div className="table-responsive-container">
            <table className="portal-data-table">
              <thead>
                <tr>
                  <th>ROUTINE ID / TAG</th>
                  <th>TRAINING GOAL</th>
                  <th>DIFFICULTY</th>
                  <th>AUTHOR</th>
                  <th>LIFECYCLE STATUS</th>
                  <th>EFFECTIVE ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {routines.map((routine) => {
                  const tagId = `RTN-${String(routine.id || 0).padStart(6, '0')}`;
                  return (
                    <tr key={routine.id} className="routine-data-row">
                      <td>
                        <div className="routine-title-cell">
                          <span className="routine-tag-id">{tagId}</span>
                          <strong className="routine-item-title">{routine.title}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-goal">
                          {routine.targetGoal || 'GENERAL'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-diff">
                          {routine.difficultyLevel || 'INTERMEDIATE'}
                        </span>
                      </td>
                      <td>
                        <span className="routine-author-text">
                          {routine.authorName || 'System'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-status-active">ACTIVE</span>
                      </td>
                      <td>
                        <div className="action-button-group">
                          <button
                            type="button"
                            className="btn btn-action-inspect"
                            onClick={() => handleInspect(routine)}
                            aria-label={`Inspect ${routine.title}`}
                          >
                            <Eye size={13} className="btn-action-icon" />
                            Inspect
                          </button>
                          {!isUser && (
                            <button
                              type="button"
                              className="btn btn-action-init"
                              onClick={() => handleInitializeSession(routine)}
                              aria-label={`Initialize ${routine.title}`}
                            >
                              <Play size={13} className="btn-action-icon" />
                              Initialize
                            </button>
                          )}
                          {(isCoordinator || (routine.authorName && user?.username && routine.authorName.toLowerCase() === user.username.toLowerCase())) && (
                            <button
                              type="button"
                              className="btn btn-action-erase"
                              onClick={() => handleDelete(routine.id)}
                              aria-label={`Erase ${routine.title}`}
                            >
                              <Trash2 size={13} className="btn-action-icon" />
                              Erase
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

        {/* Pagination Controls */}
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

      {/* Seed Routine Modal */}
      {showModal && (
        <WorkoutRoutineForm
          onClose={() => {
            setShowModal(false);
            fetchRoutinesData(currentPage, searchQuery, filterGoal);
          }}
        />
      )}

      {/* Routine Inspection Drawer/Modal */}
      {inspectingRoutine && (
        <div className="modal-backdrop-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog-container modal-lg">
            <div className="modal-header">
              <h2 className="modal-title">
                Routine Blueprint: {inspectingRoutine.title}
              </h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setInspectingRoutine(null)}
                aria-label="Close inspection"
              >
                &times;
              </button>
            </div>
            <div className="modal-body p-4">
              <RoutineExerciseList routineId={inspectingRoutine.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutRoutineList;
