import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../services/hooks';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TOrder } from '../types/order';
import { TIngredient } from '../types/ingredient';
import styles from './feed-order-details.module.css';

const FeedOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, wsConnected, error } = useAppSelector(state => state.feed);
  const ingredients = useAppSelector(state => state.ingredients.items);
  const order = orders.find((o: TOrder) => o._id === id);

  if (!wsConnected) {
    return <div className={styles.wrapper}>Загрузка заказа...</div>;
  }
  if (error) {
    return <div className={`${styles.wrapper} ${styles.error}`}>{error}</div>;
  }
  if (!order) {
    return <div className={styles.wrapper}>Заказ не найден</div>;
  }

  // Считаем состав заказа с количеством
  const ingredientMap = order.ingredients.reduce<Record<string, number>>((acc: Record<string, number>, id: string) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
  const orderIngredients = Object.entries(ingredientMap)
    .map(([id, count]) => {
      const ingredient = ingredients.find((i: TIngredient) => i._id === id);
      return ingredient ? { ...ingredient, count } : null;
    })
    .filter(Boolean);
  const totalPrice = orderIngredients.reduce((sum, i) => sum + (i!.price * (i!.count || 1)), 0);

  // Красивый статус
  const statusMap: Record<string, string> = {
    done: 'Выполнен',
    pending: 'Готовится',
    created: 'Создан',
    cancelled: 'Отменён',
  };
  const statusText = statusMap[order.status] || order.status;

  return (
    <div className={styles.wrapper}>
      <h2 className="text text_type_main-large mb-6">#{order.number}</h2>
      <div className={styles.card}>
        <div className="text text_type_main-medium mb-2">{order.name}</div>
        <div className={`text text_type_main-default mb-4 ${styles.status} ${order.status === 'done' ? styles.done : ''}`}>{statusText}</div>
        <div className="mb-6">
          <h3 className="text text_type_main-medium mb-2">Состав:</h3>
          <ul className={styles.ingredientsList}>
            {orderIngredients.map(i => (
              <li key={i!._id} className={styles.ingredientItem}>
                <img src={i!.image} alt={i!.name} className={styles.ingredientImage} />
                <span className={`text text_type_main-default ${styles.ingredientName}`}>{i!.name}</span>
                <span className={`text text_type_digits-default ${styles.price}`}>{i!.count} x {i!.price}</span>
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

export default FeedOrderDetails;
