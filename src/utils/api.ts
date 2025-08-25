import { TIngredient } from "../types/ingredient";
import { API_BASE } from './constants';

const API_URL = API_BASE;

export async function checkResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }
  return response.json();
}

export async function getIngredients(): Promise<TIngredient[]> {
  try {
    const res = await fetch(`${API_URL}/ingredients`);
    return await checkResponse<{ data: TIngredient[] }>(res).then(data => data.data);
  } catch (error) {
    console.error("Ошибка в getIngredients:", error);
    throw error;
  }
}
