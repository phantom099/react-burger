

import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { TOrder } from '../../types/order';
import { TIngredient } from '../../types/ingredient';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './order-details.module.css';

const ProfileOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = useAppSelector(state => state.profileOrders.orders.find((o: TOrder) => o._id === id));
  const ingredients = useAppSelector(state => state.ingredients.items);

  // Always call hooks at the top level
  const ingredientMap = useMemo(() => {
    if (!order) return {};
    return order.ingredients.reduce<Record<string, number>>((acc, ingId: string) => {
      acc[ingId] = (acc[ingId] || 0) + 1;
      return acc;
    }, {});
  }, [order]);

  const orderIngredients = useMemo(() => {
    return Object.entries(ingredientMap)
      .map(([ingId, count]) => {
        const ingredient = ingredients.find((i: TIngredient) => i._id === ingId);
        return ingredient ? { ...ingredient, count } : null;
      })
      .filter((x): x is TIngredient & { count: number } => x !== null);
  }, [ingredientMap, ingredients]);

  const totalPrice = useMemo(() => {
    return orderIngredients.reduce((sum: number, i) => sum + (i.price * (i.count || 1)), 0);
  }, [orderIngredients]);

  if (!order) return <div className={styles.wrapper}>Заказ не найден</div>;

  let statusText = '';
  let statusClass = 'text_color_inactive';
  switch (order.status) {
    case 'created':
      statusText = 'создан';
      break;
    case 'pending':
      statusText = 'в готовке';
      statusClass = 'text_color_warning';
      break;
    case 'done':
      statusText = 'готов';
      statusClass = 'text_color_success';
      break;
    case 'cancelled':
      statusText = 'отменён';
      statusClass = 'text_color_error';
      break;
    default:
      statusText = order.status;
  }

  return (
    <div className={styles.wrapper}>
      <div>
        <h2 className={`text text_type_main-large mb-6 ${styles.orderNumber}`}>#{order.number}</h2>
      </div>
      <div className={styles.card}>
        <div className="text text_type_main-medium mb-2">{order.name}</div>
        <div className={`text text_type_main-default mb-4 ${statusClass}`}>{statusText}</div>
        <div className="mb-6">
          <h3 className="text text_type_main-medium mb-2">Состав:</h3>
          <ul className={styles.ingredientsList}>
            {orderIngredients.map(i => (
              <li key={i!._id} className={styles.ingredientItem}>
                <img src={i!.image} alt={i!.name} className={styles.ingredientImage} />
                <span className={`text text_type_main-default ${styles.ingredientName}`}>{i!.name}</span>
                <span className={`text text_type_digits-default ${styles.ingredientPrice}`}>{i!.count} x {i!.price}</span>
                <CurrencyIcon type="primary" />
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.footer}>
          <span className="text text_type_main-default text_color_inactive">{new Date(order.createdAt).toLocaleString()}</span>
          <span className={`text text_type_digits-large ${styles.totalPrice}`}>
            {totalPrice}
            <CurrencyIcon type="primary" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileOrderDetails;
