import React from 'react';
import { TIngredient } from '../../types/ingredient';
import styles from '../../pages/profile-orders/profile-orders.module.css';

interface OrderIngredientsProps {
  ingredients: string[];
  allIngredients: TIngredient[];
  maxVisible: number;
}

export const OrderIngredients: React.FC<OrderIngredientsProps> = React.memo(({ 
  ingredients, 
  allIngredients, 
  maxVisible 
}) => {
  const orderIngredients = React.useMemo(() => {
    return ingredients
      .map(id => allIngredients.find(i => i._id === id))
      .filter((i): i is TIngredient => i !== undefined);
  }, [ingredients, allIngredients]);

  const total = orderIngredients.length;
  const showCount = total > maxVisible ? maxVisible - 1 : total;

  return (
    <>
      {orderIngredients.slice(0, showCount).map((ingredient, idx) => (
        <img
          key={ingredient._id + idx}
          src={ingredient.image}
          alt={ingredient.name}
          className={styles.ingredient_img}
        />
      ))}
      {total > maxVisible && (
        <span className={styles.ingredient_more}>+{total - showCount}</span>
      )}
    </>
  );
});