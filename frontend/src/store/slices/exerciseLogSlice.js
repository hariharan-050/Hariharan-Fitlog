import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import exerciseLogService from '../../services/exerciseLogService';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchSessionLogs = createAsyncThunk(
  'exerciseLog/fetchSessionLogs',
  async (sessionId, { rejectWithValue }) => {
    try {
      const data = await exerciseLogService.getLogsBySession(sessionId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch exercise logs'
      );
    }
  }
);

export const updateExerciseLogThunk = createAsyncThunk(
  'exerciseLog/updateExerciseLog',
  async ({ id, logData }, { rejectWithValue }) => {
    try {
      const data = await exerciseLogService.updateExerciseLog(id, logData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to update exercise log'
      );
    }
  }
);

const exerciseLogSlice = createSlice({
  name: 'exerciseLog',
  initialState,
  reducers: {
    clearLogs: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload)
          ? action.payload
          : action.payload && action.payload.content
          ? action.payload.content
          : [];
      })
      .addCase(fetchSessionLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExerciseLogThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.items.findIndex((item) => item.id === action.payload.id);
          if (idx !== -1) {
            state.items[idx] = action.payload;
          }
        }
      });
  },
});

export const { clearLogs } = exerciseLogSlice.actions;
export default exerciseLogSlice.reducer;
