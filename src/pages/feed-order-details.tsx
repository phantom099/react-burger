import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../services/hooks';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TOrder } from '../types/order';
import { TIngredient } from '../types/ingredient';
import commonStyles from '../components/order-details/order-details-common.module.css';

const FeedOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, wsConnected, error } = useAppSelector(state => state.feed);
  const ingredients = useAppSelector(state => state.ingredients.items);
  const order = orders.find((o: TOrder) => o._id === id);

  if (!wsConnected) {
    return <div className={commonStyles.wrapper}>Загрузка заказа...</div>;
  }
  if (error) {
    return <div className={commonStyles.wrapper}>{error}</div>;
  }
  if (!order) {
    return <div className={commonStyles.wrapper}>Заказ не найден</div>;
  }

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

  const statusMap: Record<string, string> = {
    done: 'Выполнен',
    pending: 'Готовится',
    created: 'Создан',
    cancelled: 'Отменён',
  };
  const statusText = statusMap[order.status] || order.status;

  return (
    <div className={commonStyles.wrapper}>
      <h2 className={`text text_type_main-large mb-6 ${commonStyles.orderNumber}`}>#{order.number}</h2>
      <div className={commonStyles.card}>
        <div className="text text_type_main-medium mb-2">{order.name}</div>
        <div className="text text_type_main-default mb-4">{statusText}</div>
        <div className="mb-6">
          <h3 className="text text_type_main-medium mb-2">Состав:</h3>
          <ul className={commonStyles.ingredientsList}>
            {orderIngredients.map(i => (
              <li key={i!._id} className={commonStyles.ingredientItem}>
                <img src={i!.image} alt={i!.name} className={commonStyles.ingredientImage} />
                <span className={`text text_type_main-default ${commonStyles.ingredientName}`}>{i!.name}</span>
                <span className={`text text_type_digits-default ${commonStyles.ingredientPrice}`}>{i!.count} x {i!.price}</span>
                <CurrencyIcon type="primary" />
              </li>
            ))}
          </ul>
        </div>
        <div className={commonStyles.footer}>
          <span className="text text_type_main-default text_color_inactive">{new Date(order.createdAt).toLocaleString()}</span>
          <span className={`text text_type_digits-large ${commonStyles.totalPrice}`}>
            {totalPrice}
            <CurrencyIcon type="primary" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedOrderDetails;
