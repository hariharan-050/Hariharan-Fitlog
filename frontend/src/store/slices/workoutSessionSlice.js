import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workoutSessionService from '../../services/workoutSessionService';

const initialState = {
  sessions: [],
  activeSession: null,
  totalPages: 1,
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk(
  'workoutSession/fetchSessions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await workoutSessionService.getSessions(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch sessions'
      );
    }
  }
);

export const startSessionThunk = createAsyncThunk(
  'workoutSession/startSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      const data = await workoutSessionService.startSession(sessionData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to start session'
      );
    }
  }
);

export const completeSessionThunk = createAsyncThunk(
  'workoutSession/completeSession',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await workoutSessionService.completeSession(id, data);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to complete session'
      );
    }
  }
);

const workoutSessionSlice = createSlice({
  name: 'workoutSession',
  initialState,
  reducers: {
    setActiveSession: (state, action) => {
      state.activeSession = action.payload;
    },
    clearActiveSession: (state) => {
      state.activeSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && Array.isArray(action.payload.content)) {
          state.sessions = action.payload.content;
          state.totalPages = action.payload.totalPages !== undefined ? action.payload.totalPages : 1;
        } else if (Array.isArray(action.payload)) {
          state.sessions = action.payload;
          state.totalPages = 1;
        } else {
          state.sessions = [];
        }
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(startSessionThunk.fulfilled, (state, action) => {
        state.activeSession = action.payload;
        if (action.payload) {
          state.sessions.unshift(action.payload);
        }
      })
      .addCase(completeSessionThunk.fulfilled, (state, action) => {
        if (state.activeSession && state.activeSession.id === action.meta.arg.id) {
          state.activeSession = null;
        }
        if (action.payload) {
          const idx = state.sessions.findIndex((s) => s.id === action.meta.arg.id);
          if (idx !== -1) {
            state.sessions[idx] = action.payload;
          }
        }
      });
  },
});

export const { setActiveSession, clearActiveSession } = workoutSessionSlice.actions;
export default workoutSessionSlice.reducer;
