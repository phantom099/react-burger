

import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './profile-orders.module.css';

const ProfileOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = useSelector((state: RootState) => state.profileOrders.orders.find(o => o._id === id));
  const ingredients = useSelector((state: RootState) => state.ingredients.items);

  // Always call hooks at the top level
  const ingredientMap = useMemo(() => {
    if (!order) return {};
    return order.ingredients.reduce<Record<string, number>>((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
  }, [order]);

  const orderIngredients = useMemo(() => {
    return Object.entries(ingredientMap)
      .map(([id, count]) => {
        const ingredient = ingredients.find(i => i._id === id);
        return ingredient ? { ...ingredient, count } : null;
      })
      .filter(Boolean);
  }, [ingredientMap, ingredients]);

  const totalPrice = useMemo(() => {
    return orderIngredients.reduce((sum, i) => sum + (i!.price * (i!.count || 1)), 0);
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
    <div className={styles.wrapper} style={{ display: "block" }}>
      <div>
        <h2 className="text text_type_main-large mb-6" style={{ display: "block" }}>#{order.number}</h2>
      </div>
      <div className={styles.card} style={{ boxShadow: "none", padding: 0 }}>
        <div className="text text_type_main-medium mb-2">{order.name}</div>
        <div className={`text text_type_main-default mb-4 ${statusClass}`}>{statusText}</div>
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
          <span className="text text_type_digits-large" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 32 }}>
            {totalPrice}
            <CurrencyIcon type="primary" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileOrderDetails;
