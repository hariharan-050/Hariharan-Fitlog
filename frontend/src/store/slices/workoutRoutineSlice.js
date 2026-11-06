import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workoutRoutineService from '../../services/workoutRoutineService';

const initialState = {
  routines: [],
  selectedRoutine: null,
  totalPages: 1,
  currentPage: 0,
  loading: false,
  error: null,
  filters: {
    query: '',
    goal: '',
  },
};

export const fetchRoutines = createAsyncThunk(
  'workoutRoutine/fetchRoutines',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await workoutRoutineService.getRoutines(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch routines'
      );
    }
  }
);

export const createRoutineThunk = createAsyncThunk(
  'workoutRoutine/createRoutine',
  async (routineData, { rejectWithValue }) => {
    try {
      const data = await workoutRoutineService.createRoutine(routineData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to create routine'
      );
    }
  }
);

export const deleteRoutineThunk = createAsyncThunk(
  'workoutRoutine/deleteRoutine',
  async (id, { rejectWithValue }) => {
    try {
      await workoutRoutineService.deleteRoutine(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to delete routine'
      );
    }
  }
);

const workoutRoutineSlice = createSlice({
  name: 'workoutRoutine',
  initialState,
  reducers: {
    setSelectedRoutine: (state, action) => {
      state.selectedRoutine = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutines.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && Array.isArray(action.payload.content)) {
          state.routines = action.payload.content;
          state.totalPages = action.payload.totalPages !== undefined ? action.payload.totalPages : 1;
        } else if (Array.isArray(action.payload)) {
          state.routines = action.payload;
          state.totalPages = 1;
        } else {
          state.routines = [];
          state.totalPages = 0;
        }
      })
      .addCase(fetchRoutines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRoutineThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.routines.unshift(action.payload);
        }
      })
      .addCase(deleteRoutineThunk.fulfilled, (state, action) => {
        state.routines = state.routines.filter((r) => r.id !== action.payload);
        if (state.selectedRoutine && state.selectedRoutine.id === action.payload) {
          state.selectedRoutine = null;
        }
      });
  },
});

export const { setSelectedRoutine, setFilters, setCurrentPage } = workoutRoutineSlice.actions;
export default workoutRoutineSlice.reducer;
