import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { wsConnect as wsProfileConnect } from '../../services/profileOrdersSlice';
import { TOrder } from '../../types/order';
import { TIngredient } from '../../types/ingredient';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from '../../pages/feed-order-details.module.css';

const ProfileOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { orders, wsConnected } = useAppSelector(state => state.profileOrders);
  const order = orders.find((o: TOrder) => o._id === id);
  const ingredients = useAppSelector(state => state.ingredients.items);

  useEffect(() => {
    if (!wsConnected) {
      dispatch(wsProfileConnect());
    }
    // No need to disconnect on unmount as the connection is shared
  }, [wsConnected, dispatch]);

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

  const { loading: ingredientsLoading } = useAppSelector(state => state.ingredients);

  if (ingredientsLoading) {
    return <div className={styles.wrapper}>Загрузка ингредиентов...</div>;
  }

  if (!wsConnected) {
    return <div className={styles.wrapper}>Подключение к серверу...</div>;
  }

  if (!order) {
    return <div className={styles.wrapper}>Заказ не найден</div>;
  }

  if (!ingredients.length) {
    return <div className={styles.wrapper}>Ошибка загрузки ингредиентов</div>;
  }

  const statusMap: Record<string, string> = {
    done: 'Выполнен',
    pending: 'Готовится',
    created: 'Создан',
    cancelled: 'Отменён',
  };
  const statusText = statusMap[order.status] || order.status;

  return (
    <div className={styles.wrapper}>
      <h2 className={`text text_type_main-large mb-6`}>#{order.number}</h2>
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

export default ProfileOrderDetails;
