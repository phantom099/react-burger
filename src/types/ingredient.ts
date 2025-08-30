export interface TIngredient {
  _id: string;
  name: string;
  type: "bun" | "sauce" | "main";
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
  uuid?: string; // Уникальный идентификатор для DND
  count?: number; // Количество ингредиентов в заказе
}
