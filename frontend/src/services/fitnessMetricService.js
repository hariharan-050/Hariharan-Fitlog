import axios from 'axios';

export const getMetrics = async (params = {}) => {
  const response = await axios.get('/api/metrics', { params });
  return response.data;
};

export const addMetric = async (metricData) => {
  const response = await axios.post('/api/metrics', metricData);
  return response.data;
};

export const updateMetric = async (id, metricData) => {
  const response = await axios.put(`/api/metrics/${id}`, metricData);
  return response.data;
};

export const deleteMetric = async (id) => {
  const response = await axios.delete(`/api/metrics/${id}`);
  return response.data;
};

const fitnessMetricService = {
  getMetrics,
  addMetric,
  updateMetric,
  deleteMetric,
};

export default fitnessMetricService;
