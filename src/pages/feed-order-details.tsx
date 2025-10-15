import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../services/store';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './feed.module.css';

const FeedOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, wsConnected, error } = useSelector((state: RootState) => state.feed);
  const ingredients = useSelector((state: RootState) => state.ingredients.items);
  const order = orders.find(o => o._id === id);

  if (!wsConnected) {
    return <div className={styles.wrapper}>Загрузка заказа...</div>;
  }
  if (error) {
    return <div className={styles.wrapper} style={{ color: 'red' }}>{error}</div>;
  }
  if (!order) {
    return <div className={styles.wrapper}>Заказ не найден</div>;
  }

  // Считаем состав заказа с количеством
  const ingredientMap = order.ingredients.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
  const orderIngredients = Object.entries(ingredientMap)
    .map(([id, count]) => {
      const ingredient = ingredients.find(i => i._id === id);
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
        <div className="text text_type_main-default mb-4" style={{ color: order.status === 'done' ? '#00CCCC' : undefined }}>{statusText}</div>
        <div className="mb-6">
          <h3 className="text text_type_main-medium mb-2">Состав:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {orderIngredients.map(i => (
              <li key={i!._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <img src={i!.image} alt={i!.name} style={{ width: 48, height: 48, borderRadius: '50%', marginRight: 12, border: '1px solid #eee' }} />
                <span className="text text_type_main-default" style={{ flex: 1 }}>{i!.name}</span>
                <span className="text text_type_digits-default" style={{ marginRight: 8 }}>{i!.count} x {i!.price}</span>
                <CurrencyIcon type="primary" />
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text text_type_main-default text_color_inactive">{new Date(order.createdAt).toLocaleString()}</span>
          <span className="text text_type_digits-large" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {totalPrice}
            <CurrencyIcon type="primary" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedOrderDetails;
