import axios from 'axios';

export const getExercisesByRoutine = async (routineId) => {
  const response = await axios.get(`/api/exercises/routine/${routineId}`);
  return response.data;
};

export const addExerciseToRoutine = async (routineId, exerciseData) => {
  const response = await axios.post(`/api/exercises/routine/${routineId}`, exerciseData);
  return response.data;
};

export const deleteExercise = async (id) => {
  const response = await axios.delete(`/api/exercises/${id}`);
  return response.data;
};

const routineExerciseService = {
  getExercisesByRoutine,
  addExerciseToRoutine,
  deleteExercise,
};

export default routineExerciseService;
