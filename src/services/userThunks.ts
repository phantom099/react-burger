import { AppDispatch } from './store';

import { setUser, clearUser, setLoading, setError } from './userSlice';
import { registerUser, loginUser, logoutUser, refreshTokenRequest, saveTokens, clearTokens, getAccessToken, getRefreshToken, getUser, updateUser, IAuthResponse, IUpdateUserResponse, IRefreshResponse } from '../utils/api';

// Получение данных пользователя с автоматическим обновлением токена
export const fetchUserThunk = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    let accessToken = getAccessToken();
    if (!accessToken) throw new Error('Нет accessToken');
    let res = await getUser(accessToken);
    dispatch(setUser(res.user));
  } catch (e: any) {
    // Если accessToken истёк, пробуем обновить
    if (e.message && e.message.includes('401')) {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('Нет refreshToken');
  const refreshRes: IRefreshResponse = await refreshTokenRequest(refreshToken);
        if (refreshRes.success) {
          saveTokens(refreshRes.accessToken, refreshRes.refreshToken);
          const userRes = await getUser(refreshRes.accessToken);
          dispatch(setUser(userRes.user));
        } else {
          // refresh не удался — делаем logout
          dispatch(logoutUserThunk());
        }
      } catch (err: any) {
        // refresh не удался — делаем logout
  dispatch(logoutUserThunk());
      }
    } else {
      dispatch(setError(e.message || 'Ошибка получения пользователя'));
    }
  } finally {
    dispatch(setLoading(false));
  }
};

// Обновление данных пользователя
export const updateUserThunk = (user: { name?: string; email?: string; password?: string }) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    let accessToken = getAccessToken();
    if (!accessToken) throw new Error('Нет accessToken');
    const res: IUpdateUserResponse = await updateUser(accessToken, user);
    if (res.success) {
      dispatch(setUser(res.user));
    } else {
      dispatch(setError('Ошибка обновления профиля'));
    }
  } catch (e: any) {
    dispatch(setError(e.message || 'Ошибка обновления профиля'));
  } finally {
    dispatch(setLoading(false));
  }
};


export const registerUserThunk = (email: string, password: string, name: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const res: IAuthResponse = await registerUser(email, password, name);
    if (res.success) {
      dispatch(setUser(res.user));
      saveTokens(res.accessToken, res.refreshToken);
    } else {
      dispatch(setError('Registration failed'));
    }
  } catch (e: any) {
    // Если сервер вернул json с message, покажем его
    let msg = e.message;
    if (e.response && typeof e.response.json === 'function') {
      try {
        const data = await e.response.json();
        msg = data.message || msg;
      } catch {}
    }
    dispatch(setError(msg || 'Registration error'));
  } finally {
    dispatch(setLoading(false));
  }
};


export const loginUserThunk = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const res: IAuthResponse = await loginUser(email, password);
    if (res.success) {
      dispatch(setUser(res.user));
      saveTokens(res.accessToken, res.refreshToken);
    } else {
      dispatch(setError('Login failed'));
    }
  } catch (e: any) {
    dispatch(setError(e.message || 'Login error'));
  } finally {
    dispatch(setLoading(false));
  }
};




export const logoutUserThunk = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const refreshToken = getRefreshToken() || '';
    await logoutUser(refreshToken);
    dispatch(clearUser());
    clearTokens();
  } catch (e: any) {
    dispatch(setError(e.message || 'Logout error'));
  } finally {
    dispatch(setLoading(false));
  }
};


export const refreshTokenThunk = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    const res: IRefreshResponse = await refreshTokenRequest(refreshToken);
    if (res.success) {
      saveTokens(res.accessToken, res.refreshToken);
    } else {
      dispatch(setError('Token refresh failed'));
    }
  } catch (e: any) {
    dispatch(setError(e.message || 'Token refresh error'));
  } finally {
    dispatch(setLoading(false));
  }
};
