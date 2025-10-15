
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../services/store';
import { wsConnect, wsDisconnect } from '../services/feedSlice';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './feed.module.css';

const FeedPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, total, totalToday, wsConnected, error } = useSelector((state: RootState) => state.feed);
  const ingredients = useSelector((state: RootState) => state.ingredients.items);

  useEffect(() => {
    dispatch(wsConnect());
    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <h2 className="text text_type_main-large mb-6">Лента заказов</h2>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
  <div className={styles.lentaa} style={{ flex: 2, minWidth: 0, maxHeight: "75vh", overflowY: 'auto' }}>
          {!wsConnected && <div>Загрузка ленты...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <ul className={styles.list}>
            {orders.map(order => (
              <li key={order._id} className={styles.card}>
                <Link
                  to={`/feed/${order._id}`}
                  className={styles.link}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="text text_type_digits-default">#{order.number}</div>
                    <div className="text text_type_main-default text_color_inactive">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text text_type_main-medium" style={{ margin: '8px 0' }}>{order.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, gap: 8, justifyContent: 'space-between' }}>
                    {/* Картинки ингредиентов */}
                    <div style={{ display: 'flex', position: 'relative', minHeight: 40 }}>
                      {order.ingredients.slice(0, 5).map((id, idx) => {
                        const ingredient = ingredients.find(i => i._id === id);
                        if (!ingredient) return null;
                        return (
                          <img
                            key={idx}
                            src={ingredient.image}
                            alt={ingredient.name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #fff',
                              position: 'relative',
                              left: idx * -12,
                              backgroundColor: '#1a1a1a',
                              zIndex: 10 - idx,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}
                          />
                        );
                      })}
                      {order.ingredients.length > 5 && (
                        <span style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          position: 'relative',
                          left: 5 * -12,
                          zIndex: 5
                        }}>+{order.ingredients.length - 5}</span>
                      )}
                    </div>
                    {/* Итоговая сумма */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="text text_type_digits-default">
                        {order.ingredients.reduce((sum, id) => {
                          const ingredient = ingredients.find(i => i._id === id);
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
        <div style={{ flex: 1}}>
          <div className={styles.summarySection}>
            <div className={styles.summarySection_block}>
              <div>
                <h3 className="text text_type_main-medium mb-2">Готовятся:</h3>
                <ul className={styles.summarySection_ul} style={{ maxHeight: "10vh", overflowY: 'auto', minWidth: 120 }}>
                  {orders.filter(o => o.status === 'pending' || o.status === 'created').slice(0, 10).map(o => (
                    <li key={o._id} className="text text_type_digits-default" style={{ color: '#F2C94C' }}>#{o.number}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text text_type_main-medium mb-2">Выполнены:</h3>
                <ul className={styles.summarySection_ul} style={{ minWidth: 120 }}>
                  {orders.filter(o => o.status === 'done').slice(0, 10).map(o => (
                    <li key={o._id} className="text text_type_digits-default" style={{ color: '#00CCCC' }}>#{o.number}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ minWidth: 180 }}>
              <h3 className="text text_type_main-medium mb-2">Всего заказов:</h3>
              <div className="text text_type_digits-large">{total}</div>
            </div>
            <div style={{ minWidth: 180 }}>
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
