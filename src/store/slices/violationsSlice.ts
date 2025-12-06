import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ViolationsState {
  cachedViolations: any[];
  lastSync: string | null;
  isOffline: boolean;
  pendingSync: any[];
}

const initialState: ViolationsState = {
  cachedViolations: [],
  lastSync: null,
  isOffline: false,
  pendingSync: [],
};

const violationsSlice = createSlice({
  name: 'violations',
  initialState,
  reducers: {
    setCachedViolations: (state, action: PayloadAction<any[]>) => {
      state.cachedViolations = action.payload;
      state.lastSync = new Date().toISOString();
    },
    addViolationToCache: (state, action: PayloadAction<any>) => {
      state.cachedViolations.unshift(action.payload);
    },
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    addToPendingSync: (state, action: PayloadAction<any>) => {
      state.pendingSync.push(action.payload);
    },
    clearPendingSync: (state) => {
      state.pendingSync = [];
    },
    removeFromPendingSync: (state, action: PayloadAction<string>) => {
      state.pendingSync = state.pendingSync.filter(item => item.id !== action.payload);
    },
  },
});

export const {
  setCachedViolations,
  addViolationToCache,
  setOfflineStatus,
  addToPendingSync,
  clearPendingSync,
  removeFromPendingSync,
} = violationsSlice.actions;

export default violationsSlice.reducer;
