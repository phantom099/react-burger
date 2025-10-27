import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../types/order';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  wsConnected: boolean;
  error?: string;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsConnected: false,
  error: undefined,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnect(state) {
      state.wsConnected = true;
      state.error = undefined;
    },
    wsDisconnect(state) {
      state.wsConnected = false;
    },
    wsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    wsMessage(state, action: PayloadAction<{ orders: TOrder[]; total: number; totalToday: number }>) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
});

export const { wsConnect, wsDisconnect, wsError, wsMessage } = feedSlice.actions;
export default feedSlice.reducer;
