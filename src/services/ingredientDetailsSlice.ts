// ingredientDetailsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../types/ingredient';

interface IngredientDetailsState {
  item: TIngredient | null;
}

const initialState: IngredientDetailsState = {
  item: null,
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredientDetails: (state, action: PayloadAction<TIngredient>) => {
      state.item = action.payload;
    },
    clearIngredientDetails: (state) => {
      state.item = null;
    },
  },
});

export const { setIngredientDetails, clearIngredientDetails } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;