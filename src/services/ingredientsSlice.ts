import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredients } from '../utils/api';
import { TIngredient } from '../types/ingredient';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => await getIngredients()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [] as TIngredient[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchIngredients.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  },
});

export default ingredientsSlice.reducer;
