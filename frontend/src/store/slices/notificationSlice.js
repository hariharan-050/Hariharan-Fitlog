import { createSlice } from '@reduxjs/toolkit';

let nextId = 1;

const initialState = {
  stack: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    pushNotification: (state, action) => {
      const { message, type = 'info', id } = action.payload || {};
      state.stack.push({
        id: id || Date.now() + '-' + nextId++,
        message,
        type,
      });
    },
    clearNotification: (state, action) => {
      const idToRemove = action.payload;
      if (idToRemove !== undefined) {
        state.stack = state.stack.filter((item) => item.id !== idToRemove);
      } else {
        state.stack.shift();
      }
    },
    clearAllNotifications: (state) => {
      state.stack = [];
    },
  },
});

export const { pushNotification, clearNotification, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
