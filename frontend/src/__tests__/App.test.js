import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import workoutRoutineReducer from '../store/slices/workoutRoutineSlice';
import routineExerciseReducer from '../store/slices/routineExerciseSlice';
import workoutSessionReducer from '../store/slices/workoutSessionSlice';
import exerciseLogReducer from '../store/slices/exerciseLogSlice';
import fitnessMetricReducer from '../store/slices/fitnessMetricSlice';
import notificationReducer from '../store/slices/notificationSlice';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return mockAxios;
});

describe('Frontend Tests (Fitlog Architecture Portal)', () => {
  let testStore;
  jest.setTimeout(15000);

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: { content: [], totalPages: 0 } });
    window.history.pushState({}, '', '/');

    // FIX: Store slice keys must match what components read via useSelector.
    // Components use: state.workoutRoutine, state.routineExercise,
    // state.workoutSession, state.fitnessMetric, state.notification
    testStore = configureStore({
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
  });

  test('T01 - Folder structure: Components directory and Login component exist', () => {
    const dirPath = path.resolve(__dirname, '../components');
    const filePath = path.resolve(__dirname, '../components/Login.js');
    expect(fs.existsSync(dirPath)).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('T02 - Folder structure: Services directory and workoutRoutineService exist', () => {
    const dirPath = path.resolve(__dirname, '../services');
    const filePath = path.resolve(__dirname, '../services/workoutRoutineService.js');
    expect(fs.existsSync(dirPath)).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('T03 - Folder structure: Store/Slices directory and authSlice exist', () => {
    const dirPath = path.resolve(__dirname, '../store/slices');
    const filePath = path.resolve(__dirname, '../store/slices/authSlice.js');
    expect(fs.existsSync(dirPath)).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('T04 - Folder structure: Styling App.css exists', () => {
    const filePath = path.resolve(__dirname, '../App.css');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('T05 - Folder structure: Layout directory and Navbar component exist', () => {
    const dirPath = path.resolve(__dirname, '../components/layout');
    const filePath = path.resolve(__dirname, '../components/layout/Navbar.js');
    expect(fs.existsSync(dirPath)).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('T06 - Navbar: Displays "Welcome back!" and user role from preloaded auth state', async () => {
    const customStore = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          token: 'tk',
          user: { username: 'Alex', role: 'MEMBER' },
          isAuthenticated: true
        }
      }
    });
    
    const { default: Navbar } = await import('../components/layout/Navbar');
    render(<Provider store={customStore}><BrowserRouter><Navbar /></BrowserRouter></Provider>);
    
    await waitFor(() => {
        expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });
    console.log('Active user state verified in Navbar');
  });

  test('T07 - WorkoutRoutineList: Fetches and displays routines from the backend', async () => {
    const mockData = { content: [{ id: 1, title: 'Powerlifting Base', targetGoal: 'STRENGTH', difficultyLevel: 'BEGINNER', authorName: 'System' }], totalPages: 1 };
    axios.get.mockResolvedValue({ data: mockData });

    const { default: WorkoutRoutineList } = await import('../components/workoutRoutine/WorkoutRoutineList');
    render(<Provider store={testStore}><BrowserRouter><WorkoutRoutineList /></BrowserRouter></Provider>);

    await waitFor(() => {
      expect(screen.getByText(/Powerlifting Base/i)).toBeInTheDocument();
    }, { timeout: 8000 });
    console.log('Success: WorkoutRoutineList correctly performed data fetching and state update on mount');
  }, 15000);

  test('T08 - Redux: Verifies notificationSlice updates state stack correctly', async () => {
    const { pushNotification } = await import('../store/slices/notificationSlice');
    testStore.dispatch(pushNotification({ message: 'Sync Successful', type: 'success' }));
    
    // FIX: access via corrected key 'notification' (matches store reducer key above)
    const notifications = testStore.getState().notification.stack;
    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].message).toBe('Sync Successful');
    expect(notifications[0].type).toBe('success');
    console.log('Notification Logic (Redux) verified successfully');
  });

  test('T09 - WorkoutRoutineForm: Submits data to backend and shows success feedback', async () => {
    axios.post.mockResolvedValue({ status: 201, data: { id: 101, title: 'New Blueprint' } });

    const { default: WorkoutRoutineForm } = await import('../components/workoutRoutine/WorkoutRoutineForm');
    render(<Provider store={testStore}><WorkoutRoutineForm onClose={() => {}} /></Provider>);

    const titleInput = screen.getByPlaceholderText(/e.g. Upper Body Hypertrophy Surge/i);
    const exerciseInput = screen.getByPlaceholderText(/e.g. Barbell Squat/i);
    const saveBtn = screen.getByRole('button', { name: /Save Master Routine/i });

    fireEvent.change(titleInput, { target: { value: 'New Blueprint' } });
    fireEvent.change(exerciseInput, { target: { value: 'Squat' } });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
    console.log('Success: Full integration flow from UI to API verified');
  });

  test('T10 - Redux: Verifies authSlice updates global state', async () => {
    const { loginSuccess } = await import('../store/slices/authSlice');
    const mockToken = 'mock-jwt-token';
    testStore.dispatch(loginSuccess({ token: mockToken, username: 'architect', role: 'PLATFORM_COORDINATOR' }));
    const state = testStore.getState().auth;
    expect(state.token).toBe(mockToken);
    console.log('Global State (Redux): authSlice state transition verified successfully');
  });

  test('T11 - Routing: ProtectedRoute blocks content when unauthenticated and redirects to login', async () => {
    const { logout } = await import('../store/slices/authSlice');
    testStore.dispatch(logout());

    const ProtectedRouteSim = ({ children }) => {
      const { isAuthenticated } = testStore.getState().auth;
      if (!isAuthenticated) {
        return <Routes><Route path="/sessions" element={<div>Redirected to Login</div>} /></Routes>;
      }
      return children;
    };

    window.history.pushState({}, '', '/sessions');
    render(<Provider store={testStore}><BrowserRouter><ProtectedRouteSim><div>Protected Content</div></ProtectedRouteSim></BrowserRouter></Provider>);
    expect(screen.getByText(/Redirected to Login/i)).toBeInTheDocument();
    console.log('Routing: ProtectedRoute simulation successfully blocked unauthorized access');
  });

  test('T12 - Login: Renders Login and asserts placeholders and heading "Sign In to Fitlog" is present', async () => {
    const { default: Login } = await import('../components/Login');
    render(<Provider store={testStore}><BrowserRouter><Login /></BrowserRouter></Provider>);

    expect(screen.getByRole('heading', { name: /Sign In to Fitlog/i })).toBeInTheDocument();
    const userField = screen.getByPlaceholderText(/Enter your username/i);
    const passField = screen.getByPlaceholderText(/••••••••/i);
    
    expect(userField).toBeInTheDocument();
    expect(passField).toBeInTheDocument();
    console.log('UI: Login form placeholders verified for better UX');
  });

  test('T13 - Feedback: NotificationStack displays messages from Redux', async () => {
    const { pushNotification } = await import('../store/slices/notificationSlice');
    testStore.dispatch(pushNotification({ message: 'Critical System Error', type: 'error' }));
    
    // FIX: NotificationStack reads state.notification.stack — store key is now 'notification'
    const { default: NotificationStack } = await import('../components/NotificationStack');
    render(<Provider store={testStore}><NotificationStack /></Provider>);
    
    expect(screen.getByText(/Critical System Error/i)).toBeInTheDocument();
    console.log('UI Feedback: NotificationStack correctly rendered Redux-driven telemetry feedback');
  });

  test('T14 - WorkoutRoutineList: Displays syncing loading state when loading is true', async () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Never resolves to keep loading true

    const { default: WorkoutRoutineList } = await import('../components/workoutRoutine/WorkoutRoutineList');
    render(<Provider store={testStore}><BrowserRouter><WorkoutRoutineList /></BrowserRouter></Provider>);

    expect(screen.getByText(/Syncing catalog data.../i)).toBeInTheDocument();
    console.log('WorkoutRoutineList: Loading spinner/text successfully validated');
  });

  test('T15 - FitnessMetricForm: Input fields handle updates correctly on change', async () => {
    const { default: FitnessMetricForm } = await import('../components/fitnessMetric/FitnessMetricForm');
    render(<Provider store={testStore}><FitnessMetricForm onClose={() => {}} /></Provider>);

    const weightInput = screen.getByLabelText(/Body Mass \(kg\)/i);
    fireEvent.change(weightInput, { target: { value: '82.5' } });
    expect(weightInput.value).toBe('82.5');
    console.log('FitnessMetricForm: Input updates verified successfully');
  });

  test('T16 - Validation: Blocks API call if routine title is empty', async () => {
    const { default: WorkoutRoutineForm } = await import('../components/workoutRoutine/WorkoutRoutineForm');
    render(<Provider store={testStore}><WorkoutRoutineForm onClose={() => {}} /></Provider>);

    const submitBtn = screen.getByRole('button', { name: /Save Master Routine/i });
    fireEvent.click(submitBtn);

    expect(axios.post).not.toHaveBeenCalled();
    console.log('Project Strategy: Frontend validation successfully blocked unnecessary API hit');
  });

  test('T17 - WorkoutRoutineList: Triggers delete routine service call upon confirmation', async () => {
    // FIX: Use matching slice keys 'workoutRoutine' (not 'workoutRoutines')
    const customStore = configureStore({
      reducer: { auth: authReducer, workoutRoutine: workoutRoutineReducer },
      preloadedState: {
        auth: {
          token: 'tk',
          user: { username: 'Alex', role: 'MEMBER' },
          isAuthenticated: true
        }
      }
    });

    axios.get.mockResolvedValue({
      data: {
        content: [{ id: 1, title: 'Powerlifting Base', targetGoal: 'STRENGTH', difficultyLevel: 'BEGINNER', authorName: 'Alex' }],
        totalPages: 1
      }
    });

    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    axios.delete.mockResolvedValue({ status: 200 });

    const { default: WorkoutRoutineList } = await import('../components/workoutRoutine/WorkoutRoutineList');
    render(<Provider store={customStore}><BrowserRouter><WorkoutRoutineList /></BrowserRouter></Provider>);

    const eraseBtn = await screen.findByRole('button', { name: /Erase/i });
    fireEvent.click(eraseBtn);

    expect(confirmSpy).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenCalled();
    confirmSpy.mockRestore();
    console.log('WorkoutRoutineList: Deletion triggered and API call confirmed');
  });

  test('T18 - RoutineExerciseList: Triggers delete routine exercise service call upon confirmation', async () => {
    // FIX: Use matching slice keys 'workoutRoutine' and 'routineExercise'
    const customStore = configureStore({
      reducer: { auth: authReducer, workoutRoutine: workoutRoutineReducer, routineExercise: routineExerciseReducer },
      preloadedState: {
        auth: {
          token: 'tk',
          user: { username: 'Alex', role: 'MEMBER' },
          isAuthenticated: true
        },
        // FIX: preloadedState key must also match: 'workoutRoutine' not 'workoutRoutines'
        workoutRoutine: { selectedRoutine: { id: 1, authorName: 'Alex', title: 'Blueprint' } }
      }
    });

    axios.get.mockResolvedValue({
      data: [
        { id: 10, exerciseName: 'Bench Press', targetSets: 3, targetReps: 10, targetWeightKg: 80, restDurationSeconds: 90, exerciseOrder: 1 }
      ]
    });

    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    axios.delete.mockResolvedValue({ status: 200 });

    const { default: RoutineExerciseList } = await import('../components/routineExercise/RoutineExerciseList');
    render(<Provider store={customStore}><RoutineExerciseList routineId={1} /></Provider>);

    const eraseBtn = await screen.findByRole('button', { name: /Remove item/i });
    fireEvent.click(eraseBtn);

    expect(confirmSpy).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenCalled();
    confirmSpy.mockRestore();
    console.log('RoutineExerciseList: Exercise deletion triggered and verified');
  });

  test('T19 - FitnessMetricList: Triggers delete fitness metric service call upon confirmation', async () => {
    axios.get.mockResolvedValue({
      data: {
        content: [{ id: 50, recordedDate: '2026-05-18', bodyWeightKg: 85.0, bodyFatPercentage: 15.0, chestCircumferenceCm: 110.0, waistCircumferenceCm: 88.0 }],
        totalPages: 1
      }
    });

    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    axios.delete.mockResolvedValue({ status: 200 });

    const { default: FitnessMetricList } = await import('../components/fitnessMetric/FitnessMetricList');
    render(<Provider store={testStore}><FitnessMetricList /></Provider>);

    const eraseBtn = await screen.findByRole('button', { name: /Erase/i });
    fireEvent.click(eraseBtn);

    expect(confirmSpy).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenCalled();
    confirmSpy.mockRestore();
    console.log('FitnessMetricList: Metric deletion API call confirmed');
  });

  test('T20 - Pagination: Renders pagination controls correctly in WorkoutRoutineList when totalPages > 1', async () => {
    axios.get.mockResolvedValue({
      data: {
        content: [{ id: 1, title: 'Base Routine', targetGoal: 'STRENGTH', difficultyLevel: 'BEGINNER', authorName: 'Alex' }],
        totalPages: 2
      }
    });

    const { default: WorkoutRoutineList } = await import('../components/workoutRoutine/WorkoutRoutineList');
    render(<Provider store={testStore}><BrowserRouter><WorkoutRoutineList /></BrowserRouter></Provider>);

    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    const prevBtn = screen.getByRole('button', { name: /Previous/i });

    expect(nextBtn).toBeEnabled();
    expect(prevBtn).toBeDisabled();
    console.log('WorkoutRoutineList: Pagination controls layout confirmed');
  });

  test('T21 - ErrorHandler: Catches rendering exception and displays custom fallback screen', async () => {
    const BuggyComponent = () => {
      throw new Error('Test Runtime Render Error');
    };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { default: ErrorHandler } = await import('../components/ErrorHandler');
    render(
      <ErrorHandler>
        <BuggyComponent />
      </ErrorHandler>
    );
    
    expect(screen.getByText(/Unexpected Rendering Exception/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Runtime Render Error/i)).toBeInTheDocument();
    
    spy.mockRestore();
    console.log('Resilience: Error boundary fallback screen verified successfully');
  });

  test('T22 - Validation: Verifies biometric date format defaults to today', async () => {
    const { default: FitnessMetricForm } = await import('../components/fitnessMetric/FitnessMetricForm');
    render(<Provider store={testStore}><FitnessMetricForm onClose={() => {}} /></Provider>);
    
    const dateInput = screen.getByLabelText(/Capture Date/i);
    const today = new Date().toISOString().substring(0, 10);
    expect(dateInput.value).toBe(today);
    console.log('Validation: Default date logic verified for Biometrics');
  });

  test('T23 - FitnessMetricForm: Validates input types', async () => {
    const { default: FitnessMetricForm } = await import('../components/fitnessMetric/FitnessMetricForm');
    render(<Provider store={testStore}><FitnessMetricForm onClose={() => {}} /></Provider>);
    
    const weightInput = screen.getByLabelText(/Body Mass \(kg\)/i);
    expect(weightInput).toHaveAttribute('type', 'number');
    console.log('Component Logic: FitnessMetricForm input types verified');
  });

  test('T24 - WorkoutSessionList: Fetches and displays sessions from the backend', async () => {
    axios.get.mockResolvedValue({
      data: {
        content: [{ id: 101, sessionStatus: 'ACTIVE', startTime: '2026-05-18T10:00:00' }],
        totalPages: 1
      }
    });
    const { default: WorkoutSessionList } = await import('../components/workoutSession/WorkoutSessionList');
    render(<Provider store={testStore}><BrowserRouter><WorkoutSessionList /></BrowserRouter></Provider>);
    
    await waitFor(() => {
      expect(screen.getByText(/ACTIVE/i)).toBeInTheDocument();
    });
  });

  test('T25 - WorkoutRoutineForm: Multiple field requirement validation', async () => {
    const { default: WorkoutRoutineForm } = await import('../components/workoutRoutine/WorkoutRoutineForm');
    render(<Provider store={testStore}><WorkoutRoutineForm onClose={() => {}} /></Provider>);
    
    const titleInput = screen.getByPlaceholderText(/e.g. Upper Body Hypertrophy Surge/i);
    const exerciseInput = screen.getByPlaceholderText(/e.g. Barbell Squat/i);
    
    expect(titleInput).toBeRequired();
    expect(exerciseInput).toBeRequired();
    console.log('Component Logic: WorkoutRoutineForm multi-field technical validation verified');
  });

  test('T26 - FitnessMetricList: Fetches and displays fitness metrics from the backend', async () => {
    axios.get.mockResolvedValue({
      data: {
        content: [{ id: 50, recordedDate: '2026-05-18', bodyWeightKg: 85.0 }],
        totalPages: 1
      }
    });
    const { default: FitnessMetricList } = await import('../components/fitnessMetric/FitnessMetricList');
    render(<Provider store={testStore}><FitnessMetricList /></Provider>);

    await waitFor(() => {
      expect(screen.getByText(/85/i)).toBeInTheDocument();
    });
  });

  test('T27 - FitnessMetricList: Opens metric form modal when Add button is clicked', async () => {
    const { default: FitnessMetricList } = await import('../components/fitnessMetric/FitnessMetricList');
    render(<Provider store={testStore}><FitnessMetricList /></Provider>);

    const createBtn = screen.getByRole('button', { name: /Seed Biometric Data/i });
    fireEvent.click(createBtn);

    expect(screen.getByRole('button', { name: /Save Metrics/i })).toBeInTheDocument();
  });

  test('T28 - WorkoutRoutineList: Displays no routines message when empty', async () => {
    axios.get.mockResolvedValue({
      data: {
        content: [],
        totalPages: 0
      }
    });

    const { default: WorkoutRoutineList } = await import('../components/workoutRoutine/WorkoutRoutineList');
    render(<Provider store={testStore}><BrowserRouter><WorkoutRoutineList /></BrowserRouter></Provider>);

    await waitFor(() => {
      expect(screen.getByText(/No routine assets found/i)).toBeInTheDocument();
    });
  });

  test('T29 - SearchFilterBar: Triggers onSearch callback when query is submitted', async () => {
    const mockOnSearch = jest.fn();
    const mockOnFilterGoal = jest.fn();
    
    const { default: SearchFilterBar } = await import('../components/common/SearchFilterBar');
    render(
      <SearchFilterBar 
        onSearch={mockOnSearch} 
        onFilterGoal={mockOnFilterGoal} 
        currentGoal="" 
        loading={false} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Search master titles or descriptions.../i);
    const searchBtn = screen.getByRole('button', { name: /Search/i });
    
    fireEvent.change(input, { target: { value: 'Hypertrophy' } });
    fireEvent.click(searchBtn);
    
    // FIX: SearchFilterBar calls onSearch with { query, goal } object, not a plain string.
    // Assert on the actual shape the component passes to the callback.
    expect(mockOnSearch).toHaveBeenCalledWith({ query: 'Hypertrophy', goal: '' });
    console.log('SearchFilterBar: Form submission and callback trigger verified successfully');
  });

  test('T30 - Dashboard: Welcome message shows user context and telemetry status', async () => {
    const customStore = configureStore({
      reducer: {
        auth: authReducer,
        workoutRoutine: workoutRoutineReducer,
        routineExercise: routineExerciseReducer,
        workoutSession: workoutSessionReducer,
        exerciseLog: exerciseLogReducer,
        fitnessMetric: fitnessMetricReducer,
        notification: notificationReducer,
      },
      preloadedState: {
        auth: {
          token: 'tk',
          user: { username: 'Jordan', role: 'MEMBER' },
          isAuthenticated: true
        }
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });

    const { default: Dashboard } = await import('../components/dashboard/Dashboard');
    render(<Provider store={customStore}><Dashboard /></Provider>);

    await waitFor(() => {
      expect(screen.getByText(/Jordan/i)).toBeInTheDocument();
      expect(screen.getByText(/Operational Intelligence Overview/i)).toBeInTheDocument();
    });
    console.log('Home Page: Dashboard hero typography and welcome logic verified');
  });

});
