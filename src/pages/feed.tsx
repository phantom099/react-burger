
import React, { useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleIcons, setVisibleIcons] = useState<number>(5);

  useEffect(() => {
    // Debug: log that we're about to connect to feed WS
    // eslint-disable-next-line no-console
    console.debug('[FeedPage] dispatching wsConnect');
    dispatch(wsConnect());
    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  // compute how many icons can fit into the ingredients container
  useEffect(() => {
    const compute = () => {
      const el = containerRef.current;
      if (!el) return;
      const style = getComputedStyle(el);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      const available = el.clientWidth - paddingLeft - paddingRight;
      const ICON_SIZE = 40; // px
      const GAP = 8; // px (approximate)
      const per = ICON_SIZE + GAP;
      const count = Math.max(1, Math.floor(available / per));
      setVisibleIcons(count);
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [orders, ingredients]);

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
                    <div className={styles.ingredientsContainer} ref={containerRef}>
                      {
                        (() => {
                          const total = order.ingredients.length;
                          // if more than can fit, reserve last slot for +N
                          if (total > visibleIcons) {
                            const showCount = Math.max(1, visibleIcons - 1);
                            return (
                              <>
                                {order.ingredients.slice(0, showCount).map((id: string, idx: number) => {
                                  const ingredient = ingredients.find((i: TIngredient) => i._id === id);
                                  if (!ingredient) return null;
                                  return (
                                    <img
                                      key={id + idx}
                                      src={ingredient.image}
                                      alt={ingredient.name}
                                      className={styles.ingredientImage}
                                    />
                                  );
                                })}
                                <span className={styles.moreIngredients}>+{total - showCount}</span>
                              </>
                            );
                          }
                          return order.ingredients.map((id: string, idx: number) => {
                            const ingredient = ingredients.find((i: TIngredient) => i._id === id);
                            if (!ingredient) return null;
                            return (
                              <img
                                key={id + idx}
                                src={ingredient.image}
                                alt={ingredient.name}
                                className={styles.ingredientImage}
                              />
                            );
                          });
                        })()
                      }
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
