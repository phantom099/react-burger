import { TIngredient } from "../types/ingredient";

const API_URL = "https://norma.nomoreparties.space/api";

export async function getIngredients(): Promise<TIngredient[]> {
  try {
      const res = await fetch(`${API_URL}/ingredients`);
      if (!res.ok) throw new Error("Ошибка загрузки ингредиентов");
      const data = await res.json();
      return data.data;
  }
  catch (error) {
      console.error("Ошибка в getIngredients:", error);
      throw error;
  }
}
