import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../types/ingredient';

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState: {
    item: null as TIngredient | null,
  },
  reducers: {
    setIngredientDetails(state, action: PayloadAction<TIngredient>) {
      state.item = action.payload;
    },
    clearIngredientDetails(state) {
      state.item = null;
    },
  },
});

export const { setIngredientDetails, clearIngredientDetails } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
