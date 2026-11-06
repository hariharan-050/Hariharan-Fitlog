import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workoutRoutineReducer from './slices/workoutRoutineSlice';
import routineExerciseReducer from './slices/routineExerciseSlice';
import workoutSessionReducer from './slices/workoutSessionSlice';
import exerciseLogReducer from './slices/exerciseLogSlice';
import fitnessMetricReducer from './slices/fitnessMetricSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workoutRoutine: workoutRoutineReducer,
    routineExercise: routineExerciseReducer,
    workoutSession: workoutSessionReducer,
    exerciseLog: exerciseLogReducer,
    fitnessMetric: fitnessMetricReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
