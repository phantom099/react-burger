import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../services/hooks';
import { wsConnect } from '../services/feedSlice';
import { TOrder } from '../types/order';
import { TIngredient } from '../types/ingredient';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './feed-order-page.module.css';

const FeedOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { orders, wsConnected, error } = useAppSelector(state => state.feed);
  const ingredients = useAppSelector(state => state.ingredients.items);
  const ingredientsLoading = useAppSelector(state => state.ingredients.loading);
  const order = orders.find((o: TOrder) => o._id === id);

  useEffect(() => {
    if (!wsConnected) {
      dispatch(wsConnect());
    }
    // Ingredients are loaded once in App; don't fetch here to avoid duplicates
    // Не закрываем ws при анмаунте, чтобы соединение оставалось для других страниц
    // eslint-disable-next-line
  }, [dispatch, wsConnected, ingredients]);

  if (ingredientsLoading || !ingredients || ingredients.length === 0) {
    return <div className={styles.wrapper}>Загрузка ингредиентов...</div>;
  }

  if (!wsConnected) {
    return <div className={styles.wrapper}>Загрузка заказа...</div>;
  }
  if (error) {
    return <div className={`${styles.wrapper} ${styles.error}`}>{error}</div>;
  }
  if (!order) {
    return <div className={styles.wrapper}>Заказ не найден</div>;
  }

  const ingredientMap = order.ingredients.reduce<Record<string, number>>((acc: Record<string, number>, id: string) => {
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
      <div className={styles.card}>
        <h2 className={`text text_type_main-large mb-6 ${styles.number}`}>#{order.number}</h2>
        <div className="text text_type_main-medium mb-2">{order.name}</div>
        <div className={`text text_type_main-default mb-4 ${statusClass}`}>{statusText}</div>
        <div className={`mb-6 ${styles.ingredientsList}`}>
          <h3 className="text text_type_main-medium mb-2">Состав:</h3>
          <ul className={styles.list}>
            {order.ingredients.map((id: string, idx: number) => {
              const ingredient = ingredients.find((i: TIngredient) => i._id === id);
              if (!ingredient) {
                return (
                  <li key={idx} className={styles.listItem}>
                    <span className={`text text_type_main-default ${styles.errorText}`}>Ингредиент не найден</span>
                  </li>
                );
              }
              const count = order.ingredients.filter((x: string) => x === id).length;
              return (
                <li key={id + idx} className={styles.listItem}>
                  <img src={ingredient.image} alt={ingredient.name} className={styles.ingredientImage} />
                  <span className={`text text_type_main-default ${styles.ingredientName}`}>{ingredient.name}</span>
                  <span className={`text text_type_digits-default ${styles.price}`}>{count} x {ingredient.price}</span>
                  <CurrencyIcon type="primary" />
                </li>
              ); 
            })}
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

export default FeedOrderPage;
