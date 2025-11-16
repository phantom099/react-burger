import React from 'react';
import { TIngredient } from '../../types/ingredient';
import { useOrderPrice } from '../../hooks/use-order-price';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

interface OrderPriceProps {
  ingredients: string[];
  allIngredients: TIngredient[];
}

export const OrderPrice: React.FC<OrderPriceProps> = React.memo(({ 
  ingredients, 
  allIngredients 
}) => {
  const price = useOrderPrice(ingredients, allIngredients);
  
  return (
    <div className="order-price">
      <span className="text text_type_digits-default">{price}</span>
      <CurrencyIcon type="primary" />
    </div>
  );
});