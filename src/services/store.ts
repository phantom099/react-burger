import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer, { ConstructorState } from './constructorSlice';
import ingredientDetailsReducer from './ingredientDetailsSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    constructor: constructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
  },
  devTools: true,
});

export type RootState = {
  ingredients: ReturnType<typeof ingredientsReducer>;
  constructor: ConstructorState;
  ingredientDetails: ReturnType<typeof ingredientDetailsReducer>;
  order: ReturnType<typeof orderReducer>;
};
export type AppDispatch = typeof store.dispatch;
