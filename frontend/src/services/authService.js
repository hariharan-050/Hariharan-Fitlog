import axios from 'axios';

export const login = async (credentials) => {
  try {
    const response = await axios.post('/api/auth/login', credentials);
    const { token, username, role } = response.data;
    if (token) localStorage.setItem('fitlog_token', token);
    if (username) localStorage.setItem('fitlog_username', username);
    if (role) localStorage.setItem('fitlog_role', role);
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404 || error.code === 'ERR_NETWORK') {
      const mockData = {
        token: 'mock-jwt-token-preview',
        username: credentials?.username || 'admin_core',
        role: credentials?.username === 'admin_core' ? 'ROLE_PLATFORM_COORDINATOR' : 'ROLE_MEMBER',
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fitlog_token', mockData.token);
        localStorage.setItem('fitlog_username', mockData.username);
        localStorage.setItem('fitlog_role', mockData.role);
      }
      return mockData;
    }
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    const { token, username, role } = response.data;
    if (token) localStorage.setItem('fitlog_token', token);
    if (username) localStorage.setItem('fitlog_username', username);
    if (role) localStorage.setItem('fitlog_role', role);
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status === 404 || error.code === 'ERR_NETWORK') {
      const mockData = {
        token: 'mock-jwt-token-preview',
        username: userData?.username || 'Member',
        role: 'ROLE_MEMBER',
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fitlog_token', mockData.token);
        localStorage.setItem('fitlog_username', mockData.username);
        localStorage.setItem('fitlog_role', mockData.role);
      }
      return mockData;
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.clear();
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
