import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('fitlog_token') : null;
const storedUsername = typeof localStorage !== 'undefined' ? localStorage.getItem('fitlog_username') : null;
const storedRole = typeof localStorage !== 'undefined' ? localStorage.getItem('fitlog_role') : null;

const initialState = {
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken),
  user: storedToken
    ? {
        username: storedUsername || 'User',
        role: storedRole || 'MEMBER',
      }
    : null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Login failed'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Registration failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, username, role } = action.payload || {};
      state.token = token || null;
      state.isAuthenticated = true;
      state.user = {
        username: username || '',
        role: role || 'MEMBER',
      };
      state.error = null;
      if (typeof localStorage !== 'undefined') {
        if (token) localStorage.setItem('fitlog_token', token);
        if (username) localStorage.setItem('fitlog_username', username);
        if (role) localStorage.setItem('fitlog_role', role);
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      if (typeof localStorage !== 'undefined') {
        authService.logout();
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const { token, username, role } = action.payload || {};
        state.token = token;
        state.isAuthenticated = true;
        state.user = {
          username: username || '',
          role: role || 'MEMBER',
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        const { token, username, role } = action.payload || {};
        state.token = token;
        state.isAuthenticated = true;
        state.user = {
          username: username || '',
          role: role || 'MEMBER',
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { loginSuccess, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
