import { useMemo } from 'react';
import { TIngredient } from '../types/ingredient';

export const useOrderPrice = (ingredients: string[], allIngredients: TIngredient[]): number => {
  return useMemo(() => {
    return ingredients.reduce((sum: number, id: string) => {
      const ingredient = allIngredients.find((i: TIngredient) => i._id === id);
      return sum + (ingredient ? ingredient.price : 0);
    }, 0);
  }, [ingredients, allIngredients]);
};