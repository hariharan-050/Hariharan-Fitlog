import axios from 'axios';

export const getSessions = async (params = {}) => {
  const response = await axios.get('/api/sessions', { params });
  return response.data;
};

export const startSession = async (sessionData) => {
  const routineId = typeof sessionData === 'object' ? sessionData?.routineId : sessionData;
  const config = routineId ? { params: { routineId } } : {};
  const response = await axios.post('/api/sessions/start', sessionData, config);
  return response.data;
};

export const completeSession = async (id, completionData = []) => {
  const payload = Array.isArray(completionData)
    ? completionData
    : completionData?.logs || [];
  const response = await axios.put(`/api/sessions/${id}/complete`, payload);
  return response.data;
};

export const resumeSession = async (id) => {
  const response = await axios.put(`/api/sessions/${id}/resume`);
  return response.data;
};

export const cancelSession = async (id) => {
  const response = await axios.delete(`/api/sessions/${id}`);
  return response.data;
};

const workoutSessionService = {
  getSessions,
  startSession,
  completeSession,
  resumeSession,
  cancelSession,
};

export default workoutSessionService;
