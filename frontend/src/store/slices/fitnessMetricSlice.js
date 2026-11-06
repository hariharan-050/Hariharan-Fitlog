import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fitnessMetricService from '../../services/fitnessMetricService';

const initialState = {
  metrics: [],
  totalPages: 1,
  currentPage: 0,
  loading: false,
  error: null,
};

export const fetchMetrics = createAsyncThunk(
  'fitnessMetric/fetchMetrics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await fitnessMetricService.getMetrics(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch fitness metrics'
      );
    }
  }
);

export const addMetricThunk = createAsyncThunk(
  'fitnessMetric/addMetric',
  async (metricData, { rejectWithValue }) => {
    try {
      const data = await fitnessMetricService.addMetric(metricData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to add metric'
      );
    }
  }
);

export const deleteMetricThunk = createAsyncThunk(
  'fitnessMetric/deleteMetric',
  async (id, { rejectWithValue }) => {
    try {
      await fitnessMetricService.deleteMetric(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to delete metric'
      );
    }
  }
);

const fitnessMetricSlice = createSlice({
  name: 'fitnessMetric',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && Array.isArray(action.payload.content)) {
          state.metrics = action.payload.content;
          state.totalPages = action.payload.totalPages !== undefined ? action.payload.totalPages : 1;
        } else if (Array.isArray(action.payload)) {
          state.metrics = action.payload;
          state.totalPages = 1;
        } else {
          state.metrics = [];
        }
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMetricThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.metrics.unshift(action.payload);
        }
      })
      .addCase(deleteMetricThunk.fulfilled, (state, action) => {
        state.metrics = state.metrics.filter((m) => m.id !== action.payload);
      });
  },
});

export const { setCurrentPage } = fitnessMetricSlice.actions;
export default fitnessMetricSlice.reducer;
