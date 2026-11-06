import axios from 'axios';

export const getRoutines = async (params = {}) => {
  const response = await axios.get('/api/routines', { params });
  return response.data;
};

export const getRoutineById = async (id) => {
  const response = await axios.get(`/api/routines/${id}`);
  return response.data;
};

export const createRoutine = async (routineData) => {
  const payload = {
    title: routineData.title,
    description: routineData.description,
    goal: routineData.goal || routineData.targetGoal,
    difficulty: routineData.difficulty || routineData.difficultyLevel,
    isPublic: routineData.isPublic !== undefined ? routineData.isPublic : true,
  };
  const response = await axios.post('/api/routines', payload);
  const created = response.data;

  if (routineData.exercises && Array.isArray(routineData.exercises) && created && created.id) {
    for (const ex of routineData.exercises) {
      if (ex.exerciseName && ex.exerciseName.trim()) {
        try {
          await axios.post(`/api/routine-exercises/routine/${created.id}`, {
            routineId: created.id,
            exerciseName: ex.exerciseName.trim(),
            sets: ex.sets || ex.targetSets || 3,
            reps: ex.reps || ex.targetReps || 10,
            weight: ex.weight !== undefined ? ex.weight : (ex.targetWeightKg !== undefined ? ex.targetWeightKg : 0),
            durationSeconds: ex.durationSeconds || ex.restDurationSeconds || 60,
          });
        } catch (err) {
          console.warn('Failed to add exercise to routine:', err);
        }
      }
    }
  }

  return created;
};

export const updateRoutine = async (id, routineData) => {
  const payload = {
    ...routineData,
    goal: routineData.goal || routineData.targetGoal,
    difficulty: routineData.difficulty || routineData.difficultyLevel,
  };
  const response = await axios.put(`/api/routines/${id}`, payload);
  return response.data;
};

export const deleteRoutine = async (id) => {
  const response = await axios.delete(`/api/routines/${id}`);
  return response.data;
};

const workoutRoutineService = {
  getRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
};

export default workoutRoutineService;
