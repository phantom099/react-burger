import { TIngredient } from "../types/ingredient";
import { API_BASE } from "./constants";
import { setCookie, getCookie, deleteCookie } from './cookie';
// --- Выход пользователя ---
export async function logoutUser(refreshToken: string) {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });
  return checkResponse(res);
}

// --- Обновление accessToken ---
export async function refreshTokenRequest(refreshToken: string) {
  const res = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });
  return checkResponse(res);
}

// --- Получение данных пользователя ---
export interface IUserResponse {
  success: boolean;
  user: { name: string; email: string };
}
export async function getUser(accessToken: string): Promise<IUserResponse> {
  const res = await fetch(`${API_URL}/auth/user`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: accessToken },
  });
  return checkResponse<IUserResponse>(res);
}

// --- Обновление данных пользователя ---
export async function updateUser(
  accessToken: string,
  user: { name?: string; email?: string; password?: string }
) {
  const res = await fetch(`${API_URL}/auth/user`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: accessToken },
    body: JSON.stringify(user),
  });
  return checkResponse(res);
}
// --- Аутентификация ---
export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  return checkResponse(res);
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return checkResponse(res);
}

// --- Работа с токенами ---

// accessToken — только в localStorage, refreshToken — только в cookie
export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  setCookie("refreshToken", refreshToken, { path: '/', expires: 60 * 60 * 24 * 7 }); // 7 дней
}


export function clearTokens() {
  localStorage.removeItem("accessToken");
  deleteCookie("refreshToken");
}


export function getAccessToken() {
  return localStorage.getItem("accessToken");
}


export function getRefreshToken() {
  return getCookie("refreshToken");
}

const API_URL = API_BASE;

export async function checkResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Если сервер вернул message — покажем его, иначе просто статус
    const msg = data && data.message ? data.message : `Ошибка: ${response.status}`;
    const error = new Error(msg);
    // @ts-ignore
    error.response = response;
    // @ts-ignore
    error.data = data;
    throw error;
  }
  return data;
}

export async function getIngredients(): Promise<TIngredient[]> {
  try {
    const res = await fetch(`${API_URL}/ingredients`);
    return await checkResponse<{ data: TIngredient[] }>(res).then(
      (data) => data.data
    );
  } catch (error) {
    console.error("Ошибка в getIngredients:", error);
    throw error;
  }
}
