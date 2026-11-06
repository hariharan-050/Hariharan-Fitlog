import axios from 'axios';

export const getLogsBySession = async (sessionId) => {
  const response = await axios.get(`/api/logs/session/${sessionId}`);
  return response.data;
};

export const updateExerciseLog = async (id, logData) => {
  const response = await axios.put(`/api/logs/${id}`, logData);
  return response.data;
};

const exerciseLogService = {
  getLogsBySession,
  updateExerciseLog,
};

export default exerciseLogService;
