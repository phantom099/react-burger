import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../types/ingredient';

export interface ConstructorState {
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
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.mains.push(action.payload);
      }
    },
    removeIngredient(state, action: PayloadAction<number>) {
      state.mains.splice(action.payload, 1);
    },
    moveIngredient(state, action: PayloadAction<{from: number; to: number;}>) {
      const { from, to } = action.payload;
      const [removed] = state.mains.splice(from, 1);
      state.mains.splice(to, 0, removed);
    },
    clearConstructor(state) {
      state.bun = null;
      state.mains = [];
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } = constructorSlice.actions;
export default constructorSlice.reducer;
