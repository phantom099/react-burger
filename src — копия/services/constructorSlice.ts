import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../types/ingredient';
import { v4 as uuidv4 } from 'uuid';

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
      try {
        state.bun = action.payload;
      } catch (error) {
        console.error('Error in setBun:', error);
        state.bun = null;
      }
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      try {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          if (!Array.isArray(state.mains)) {
            state.mains = [];
          }
          state.mains.push({ 
            ...action.payload, 
            uuid: uuidv4() 
          });
        }
      } catch (error) {
        console.error('Error in addIngredient:', error);
        if (!Array.isArray(state.mains)) {
          state.mains = [];
        }
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      try {
        if (state.bun && state.bun._id === action.payload) {
          state.bun = null;
        } else {
          if (!Array.isArray(state.mains)) {
            state.mains = [];
          } else {
            state.mains = state.mains.filter(ingredient => 
              ingredient._id !== action.payload
            );
          }
        }
      } catch (error) {
        console.error('Error in removeIngredient:', error);
        if (!Array.isArray(state.mains)) {
          state.mains = [];
        }
      }
    },
    reorderIngredients(state, action: PayloadAction<{ from: number; to: number }>) {
      try {
        const { from, to } = action.payload;
        
        if (!Array.isArray(state.mains)) {
          state.mains = [];
        }
        
        if (from >= 0 && from < state.mains.length && 
            to >= 0 && to <= state.mains.length) {
          const [movedItem] = state.mains.splice(from, 1);
          state.mains.splice(to, 0, movedItem);
        }
      } catch (error) {
        console.error('Error in reorderIngredients:', error);
        if (!Array.isArray(state.mains)) {
          state.mains = [];
        }
      }
    },
    clearConstructor(state) {
      try {
        state.bun = null;
        state.mains = [];
      } catch (error) {
        console.error('Error in clearConstructor:', error);
        state.bun = null;
        state.mains = [];
      }
    },
  },
});

export const { setBun, addIngredient, removeIngredient, reorderIngredients, clearConstructor } = constructorSlice.actions;
export type { ConstructorState };
export default constructorSlice.reducer;