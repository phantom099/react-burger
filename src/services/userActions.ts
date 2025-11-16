import { createAction } from '@reduxjs/toolkit';

export const registerRequest = createAction('user/registerRequest');
export const registerSuccess = createAction<{ email: string; name: string }>('user/registerSuccess');
export const registerFailure = createAction<string>('user/registerFailure');

export const loginRequest = createAction('user/loginRequest');
export const loginSuccess = createAction<{ email: string; name: string }>('user/loginSuccess');
export const loginFailure = createAction<string>('user/loginFailure');

export const logoutRequest = createAction('user/logoutRequest');
export const logoutSuccess = createAction('user/logoutSuccess');
export const logoutFailure = createAction<string>('user/logoutFailure');

export const tokenRefreshRequest = createAction('user/tokenRefreshRequest');
export const tokenRefreshSuccess = createAction('user/tokenRefreshSuccess');
export const tokenRefreshFailure = createAction<string>('user/tokenRefreshFailure');
