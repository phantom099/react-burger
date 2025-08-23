import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../types/ingredient';

interface ConstructorState {
  bun: TIngredient | null;
  mains: TIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  mains: [],
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (!state.mains) {
        state.mains = [];
      }
      state.mains.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      try {
        if (state.bun && state.bun._id === action.payload) {
          state.bun = null;
        } else {
          state.mains = state.mains.filter(ingredient => ingredient._id !== action.payload);
        }
      } catch (error) {
        console.error('Error in removeIngredient reducer:', error);
      }
    },
    reorderIngredients(state, action: PayloadAction<{ from: number; to: number }>) {
      const [removed] = state.mains.splice(action.payload.from, 1);
      state.mains.splice(action.payload.to, 0, removed);
    },
  },
});

export const { setBun, addIngredient, removeIngredient, reorderIngredients } = constructorSlice.actions;

export type { ConstructorState };

export default constructorSlice.reducer;
