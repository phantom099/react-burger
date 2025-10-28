// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { createWSMiddleware } from './wsMiddleware';

import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice'; // Убедитесь в правильности пути
import ingredientDetailsReducer from './ingredientDetailsSlice';
import orderReducer from './orderSlice';
import userReducer from './userSlice';
import feedReducer from './feedSlice';
import profileOrdersReducer from './profileOrdersSlice';

const feedWS = createWSMiddleware({
  wsUrl: 'wss://norma.nomoreparties.space/orders/all',
  wsActions: {
    wsConnect: 'feed/wsConnect',
    wsDisconnect: 'feed/wsDisconnect',
    wsConnecting: 'feed/wsConnecting',
    wsOpen: 'feed/wsConnect',
    wsClose: 'feed/wsDisconnect',
    wsError: 'feed/wsError',
    wsMessage: 'feed/wsMessage',
  },
});

const profileOrdersWS = createWSMiddleware({
  wsUrl: 'wss://norma.nomoreparties.space/orders',
  wsActions: {
    wsConnect: 'profileOrders/wsConnect',
    wsDisconnect: 'profileOrders/wsDisconnect',
    wsConnecting: 'profileOrders/wsConnecting',
    wsOpen: 'profileOrders/wsConnect',
    wsClose: 'profileOrders/wsDisconnect',
    wsError: 'profileOrders/wsError',
    wsMessage: 'profileOrders/wsMessage',
  },
  withToken: true,
});

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    constructorBurger: constructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
    user: userReducer,
    feed: feedReducer,
    profileOrders: profileOrdersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedWS, profileOrdersWS),
  devTools: process.env.NODE_ENV !== 'production',
});

console.log(store.getState());
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;