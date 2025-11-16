import { Middleware, MiddlewareAPI, Dispatch } from '@reduxjs/toolkit';
import { clearUser } from './userSlice';

interface WSConfig {
  wsUrl: string;
  wsActions: {
    wsConnect: string;
    wsDisconnect: string;
    wsConnecting: string;
    wsOpen: string;
    wsClose: string;
    wsError: string;
    wsMessage: string;
  };
  withToken?: boolean;
}

export const createWSMiddleware = (config: WSConfig): Middleware => {
  return (store: MiddlewareAPI<Dispatch, any>) => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastConnectAction: any = null;
    return next => (action: unknown) => {
      // Приводим action к типу с type
      const act = action as { type: string; payload?: any };
      const { dispatch } = store;
      const { wsUrl, wsActions, withToken } = config;
      switch (act.type) {
        case wsActions.wsConnect: {
          lastConnectAction = act;
          let url = wsUrl;
          if (withToken) {
            // Получаем accessToken из localStorage или cookie
            let token = localStorage.getItem('accessToken');
            if (!token) {
              // Попробуем из cookie (если есть утилита getCookie)
              try {
                // @ts-ignore
                const { getCookie } = require('../utils/cookie');
                token = getCookie('accessToken');
              } catch {}
            }
            if (token) {
              // Убираем Bearer, если есть
              token = token.replace(/^Bearer\s+/, '');
              url += `?token=${token}`;
            }
          }
          // Debug log: connection attempt
          // eslint-disable-next-line no-console
          console.debug('[WS-Middleware] connecting to', url, 'action=', act);
          socket = new WebSocket(url);
          dispatch({ type: wsActions.wsConnecting });
          socket.onopen = () => {
            // eslint-disable-next-line no-console
            console.debug('[WS-Middleware] socket open', url);
            dispatch({ type: wsActions.wsOpen });
          };
          socket.onerror = (ev) => {
            // eslint-disable-next-line no-console
            console.error('[WS-Middleware] socket error', ev);
            dispatch({ type: wsActions.wsError, payload: 'WebSocket error' });
          };
          socket.onclose = (ev) => {
            // eslint-disable-next-line no-console
            console.debug('[WS-Middleware] socket closed', ev);
            dispatch({ type: wsActions.wsClose });
            // Reconnect через 5 секунд, если не было явного disconnect
            if (lastConnectAction) {
              reconnectTimeout = setTimeout(() => {
                dispatch(lastConnectAction);
              }, 5000);
            }
          };
          socket.onmessage = (event: MessageEvent) => {
            try {
              // eslint-disable-next-line no-console
              console.debug('[WS-Middleware] message received', event.data);
              const data = JSON.parse(event.data);
              // Если сервер прислал ошибку авторизации — logout
              if (data.message && (data.message.includes('Invalid or missing token') || data.message.includes('jwt expired') || data.message.includes('You should be authorised'))) {
                dispatch(clearUser());
                dispatch({ type: wsActions.wsError, payload: 'Авторизация истекла. Пожалуйста, войдите снова.' });
                socket?.close();
                return;
              }
              dispatch({ type: wsActions.wsMessage, payload: data });
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('[WS-Middleware] message parse error', err);
              dispatch({ type: wsActions.wsError, payload: 'WS: Ошибка парсинга данных' });
            }
          };
          break;
        }
        case wsActions.wsDisconnect: {
          if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
          }
          lastConnectAction = null;
          if (socket) {
            socket.close();
            socket = null;
          }
          break;
        }
        default:
          break;
      }
      return next(action);
    };
  };
};
