import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../services/store';
import { wsConnect } from '../services/feedSlice';
import { fetchIngredients } from '../services/ingredientsSlice';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './feed.module.css';

const FeedOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { orders, wsConnected, error } = useSelector((state: RootState) => state.feed);
  const ingredients = useSelector((state: RootState) => state.ingredients.items);
  const ingredientsLoading = useSelector((state: RootState) => state.ingredients.loading);
  const order = orders.find(o => o._id === id);

  useEffect(() => {
    if (!wsConnected) {
      dispatch(wsConnect());
    }
    // Грузим ингредиенты если их нет
    if (!ingredients || ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
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
    return <div className={styles.wrapper} style={{ color: 'red' }}>{error}</div>;
  }
  if (!order) {
    return <div className={styles.wrapper}>Заказ не найден</div>;
  }

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
    <div className={styles.wrapper} style={{ width: '100%' }}>
      <div className={styles.card} style={{ background: "transparent" }}>
        <h2 className="text text_type_main-large mb-6" style={{ textAlign: "center" }}>#{order.number}</h2>
        <div className="text text_type_main-medium mb-2">{order.name}</div>
  <div className={`text text_type_main-default mb-4 ${statusClass}`}>{statusText}</div>
  <div className="mb-6" style={{  maxHeight: 300, overflowY: "auto" }}>
          <h3 className="text text_type_main-medium mb-2">Состав:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {order.ingredients.map((id, idx) => {
              const ingredient = ingredients.find(i => i._id === id);
              if (!ingredient) {
                return (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span className="text text_type_main-default" style={{ flex: 1, color: 'red' }}>Ингредиент не найден</span>
                  </li>
                );
              }
              const count = order.ingredients.filter(x => x === id).length;
              return (
                <li key={id + idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <img src={ingredient.image} alt={ingredient.name} style={{ width: 48, height: 48, borderRadius: '50%', marginRight: 12, border: '1px solid #eee' }} />
                  <span className="text text_type_main-default" style={{ flex: 1 }}>{ingredient.name}</span>
                  <span className="text text_type_digits-default" style={{ marginRight: 8 }}>{count} x {ingredient.price}</span>
                  <CurrencyIcon type="primary" />
                </li>
              ); 
            })}
          </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text text_type_main-default text_color_inactive">{new Date(order.createdAt).toLocaleString()}</span>
          <span className="text text_type_digits-large" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '42px' }}>
            {totalPrice}
            <CurrencyIcon type="primary" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedOrderPage;
