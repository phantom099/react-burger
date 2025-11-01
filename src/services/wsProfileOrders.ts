// WebSocket-менеджер для истории заказов пользователя (profile orders)
import { AppDispatch } from './store';
import { wsConnect, wsDisconnect, wsError, wsMessage } from './profileOrdersSlice';
import { TOrdersResponse } from '../types/order';
import { getAccessToken } from '../utils/api';
import { API_BASE } from '../utils/constants';

let socket: WebSocket | null = null;

export const connectProfileOrdersWS = (dispatch: AppDispatch) => {
  if (socket) return;
  const token = getAccessToken();
  if (!token) {
    dispatch(wsError('Нет accessToken для WebSocket'));
    return;
  }
  // accessToken должен быть без Bearer
  const cleanToken = token.replace('Bearer ', '');
  socket = new WebSocket(`wss://${API_BASE}?token=${cleanToken}`);

  socket.onopen = () => {
    dispatch(wsConnect());
  };
  socket.onclose = () => {
    dispatch(wsDisconnect());
    socket = null;
  };
  socket.onerror = () => {
    dispatch(wsError('WebSocket error'));
  };
  socket.onmessage = (event: MessageEvent) => {
    try {
      const data: TOrdersResponse = JSON.parse(event.data);
      if (data.success) {
        dispatch(wsMessage({
          orders: data.orders,
          total: data.total,
          totalToday: data.totalToday,
        }));
      } else {
        dispatch(wsError('WS: Ошибка данных'));
      }
    } catch (e) {
      dispatch(wsError('WS: Ошибка парсинга данных'));
    }
  };
};

export const disconnectProfileOrdersWS = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
