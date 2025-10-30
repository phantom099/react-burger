
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { wsConnect, wsDisconnect } from '../services/feedSlice';
import { TOrder } from '../types/order';
import { TIngredient } from '../types/ingredient';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './feed.module.css';

const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday, wsConnected, error } = useAppSelector(state => state.feed);
  const ingredients = useAppSelector(state => state.ingredients.items);
  const location = useLocation();

  useEffect(() => {
    // Debug: log that we're about to connect to feed WS
    // eslint-disable-next-line no-console
    console.debug('[FeedPage] dispatching wsConnect');
    dispatch(wsConnect());
    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <h2 className="text text_type_main-large mb-6">Лента заказов</h2>
      <div className={styles.feedContainer}>
        <div className={styles.lentaa}>
          {!wsConnected && <div>Загрузка ленты...</div>}
          {error && <div className={styles.error}>{error}</div>}
          <ul className={styles.list}>
            {orders.map((order: TOrder) => (
              <li key={order._id} className={styles.card}>
                <Link
                  to={`/feed/${order._id}`}
                  state={{ background: location }}
                  className={styles.link}
                >
                  <div className={styles.orderHeader}>
                    <div className="text text_type_digits-default">#{order.number}</div>
                    <div className="text text_type_main-default text_color_inactive">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className={`text text_type_main-medium ${styles.orderName}`}>{order.name}</div>
                  <div className={styles.orderFooter}>
                    <div className={styles.ingredientsContainer}>
                      {order.ingredients.slice(0, 5).map((id: string, idx: number) => {
                        const ingredient = ingredients.find((i: TIngredient) => i._id === id);
                        if (!ingredient) return null;
                        return (
                          <img
                            key={idx}
                            src={ingredient.image}
                            alt={ingredient.name}
                            className={styles.ingredientImage}
                            style={{ '--offset': `${idx * -12}px`, '--z-index': `${10 - idx}` } as React.CSSProperties}
                          />
                        );
                      })}
                      {order.ingredients.length > 5 && (
                        <span className={styles.moreIngredients} style={{ '--offset': `${5 * -12}px`, '--z-index': '5' } as React.CSSProperties}>
                          +{order.ingredients.length - 5}
                        </span>
                      )}
                    </div>
                    <div className={styles.priceContainer}>
                      <span className="text text_type_digits-default">
                        {order.ingredients.reduce((sum: number, id: string) => {
                          const ingredient = ingredients.find((i: TIngredient) => i._id === id);
                          return sum + (ingredient ? ingredient.price : 0);
                        }, 0)}
                      </span>
                      <CurrencyIcon type="primary" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.summaryContainer}>
          <div className={styles.summarySection}>
            <div className={styles.summarySection_block}>
              <div>
                <h3 className="text text_type_main-medium mb-2">Готовятся:</h3>
                <ul className={styles.summarySection_ul}>
                  {orders.filter((o: TOrder) => o.status === 'pending' || o.status === 'created')
                    .slice(0, 10)
                    .map((o: TOrder) => (
                      <li key={o._id} className={`text text_type_digits-default ${styles.orderPending}`}>
                        #{o.number}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="text text_type_main-medium mb-2">Выполнены:</h3>
                <ul className={styles.summarySection_ul}>
                  {orders.filter((o: TOrder) => o.status === 'done')
                    .slice(0, 10)
                    .map((o: TOrder) => (
                      <li key={o._id} className={`text text_type_digits-default ${styles.orderDone}`}>
                        #{o.number}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text text_type_main-medium mb-2">Всего заказов:</h3>
              <div className="text text_type_digits-large">{total}</div>
            </div>
            <div>
              <h3 className="text text_type_main-medium mb-2">Заказов сегодня:</h3>
              <div className="text text_type_digits-large">{totalToday}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
