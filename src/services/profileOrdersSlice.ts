import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../types/order';

interface ProfileOrdersState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  wsConnected: boolean;
  error?: string;
}

const initialState: ProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsConnected: false,
  error: undefined,
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
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

export const { wsConnect, wsDisconnect, wsError, wsMessage } = profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
