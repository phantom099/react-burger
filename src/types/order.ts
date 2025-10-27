// Типы для заказов и WebSocket-сообщений
import { TIngredient } from './ingredient';

export type TOrderStatus = 'created' | 'pending' | 'done' | 'cancelled';

export interface TOrder {
  _id: string;
  number: number;
  name: string;
  status: TOrderStatus;
  ingredients: string[]; // id ингредиентов
  createdAt: string;
  updatedAt: string;
}

export interface TOrderWithIngredients extends Omit<TOrder, 'ingredients'> {
  ingredients: TIngredient[];
}

export interface TOrdersResponse {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
}

export interface TOrderWSMessage {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  message?: string;
}

// Для приватных заказов (история пользователя)
export interface TUserOrdersResponse {
  success: boolean;
  orders: TOrder[];
}