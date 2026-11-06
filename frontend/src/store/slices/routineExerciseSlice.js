import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routineExerciseService from '../../services/routineExerciseService';

const initialState = {
  routineExercises: [],
  loading: false,
  error: null,
};

export const fetchRoutineExercises = createAsyncThunk(
  'routineExercise/fetchRoutineExercises',
  async (routineId, { rejectWithValue }) => {
    try {
      const data = await routineExerciseService.getExercisesByRoutine(routineId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch exercises'
      );
    }
  }
);

export const addExerciseToRoutineThunk = createAsyncThunk(
  'routineExercise/addExerciseToRoutine',
  async ({ routineId, exerciseData }, { rejectWithValue }) => {
    try {
      const data = await routineExerciseService.addExerciseToRoutine(routineId, exerciseData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to add exercise'
      );
    }
  }
);

export const removeExerciseFromRoutineThunk = createAsyncThunk(
  'routineExercise/removeExerciseFromRoutine',
  async (id, { rejectWithValue }) => {
    try {
      await routineExerciseService.deleteExercise(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to delete exercise'
      );
    }
  }
);

const routineExerciseSlice = createSlice({
  name: 'routineExercise',
  initialState,
  reducers: {
    clearRoutineExercises: (state) => {
      state.routineExercises = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutineExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutineExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.routineExercises = Array.isArray(action.payload)
          ? action.payload
          : action.payload && action.payload.content
          ? action.payload.content
          : [];
      })
      .addCase(fetchRoutineExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addExerciseToRoutineThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.routineExercises.push(action.payload);
        }
      })
      .addCase(removeExerciseFromRoutineThunk.fulfilled, (state, action) => {
        state.routineExercises = state.routineExercises.filter((e) => e.id !== action.payload);
      });
  },
});

export const { clearRoutineExercises } = routineExerciseSlice.actions;
export default routineExerciseSlice.reducer;
