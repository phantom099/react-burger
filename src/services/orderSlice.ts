import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../types/ingredient';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    const res = await fetch('https://norma.nomoreparties.space/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredientIds }),
    });
    if (!res.ok) throw new Error('Ошибка создания заказа');
    const data = await res.json();
    return data.order.number;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    number: null as number | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearOrder(state) {
      state.number = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<number>) => {
        state.number = action.payload;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка заказа';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
