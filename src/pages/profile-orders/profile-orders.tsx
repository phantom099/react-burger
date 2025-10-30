import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { wsConnect as wsProfileConnect, wsDisconnect as wsProfileDisconnect } from '../../services/profileOrdersSlice';
import { TOrder } from '../../types/order';
import { TIngredient } from '../../types/ingredient';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink, useLocation } from "react-router-dom";
import { getAccessToken } from '../../utils/api';

import { Link } from 'react-router-dom';
import styles from './profile-orders.module.css';

const ProfileOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, wsConnected, error } = useAppSelector(state => state.profileOrders);
  const ingredients = useAppSelector(state => state.ingredients.items);
  const location = useLocation();

  useEffect(() => {
    // Debug: check access token presence for profile WS
    // eslint-disable-next-line no-console
    console.debug('[ProfileOrders] accessToken:', getAccessToken());
    dispatch(wsProfileConnect());
    return () => {
      dispatch(wsProfileDisconnect());
    };
  }, [dispatch]);

  return (
    <section className={styles.wrapper}>
      <aside className={styles.profile_nav}>
        <nav>
          <NavLink className={({ isActive }) => `text text_type_main-medium ${isActive ? '' : 'text_color_inactive'} ${styles.navlink}`} to="/profile">Профиль</NavLink>
          <NavLink className={({ isActive }) => `text text_type_main-medium ${isActive ? '' : 'text_color_inactive'} ${styles.navlink}`} to="/profile/orders">История заказов</NavLink>
          <NavLink className={({ isActive }) => `text text_type_main-medium ${isActive ? '' : 'text_color_inactive'} ${styles.navlink}`} to="/logout">Выход</NavLink>
        </nav>
        <p className="text text_type_main-default text_color_inactive mt-10">В этом разделе вы можете просмотреть свою историю заказов</p>
      </aside>
      <main className={styles.main}>
        {!wsConnected && <div>Загрузка заказов...</div>}
        {error && <div className={styles.error}>{error}</div>}
        <ul className={styles.list}>
          {orders.map((order: TOrder) => (
            <li key={order._id} className={styles.card}>
              <Link to={`/profile/orders/${order._id}`} state={{ background: location }} className={styles.link}>
                <div className={styles.card_header}>
                  <div className="text text_type_digits-default">#{order.number}</div>
                  <div className="text text_type_main-default text_color_inactive">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className={styles.card_name}>{order.name}</div>
                <div className={`${styles.card_status} text text_type_main-default ${
                  order.status === 'done' ? 'text_color_success' :
                  order.status === 'pending' ? 'text_color_warning' :
                  order.status === 'cancelled' ? 'text_color_error' :
                  'text_color_inactive'
                }`}>
                  {order.status === 'created' && 'создан'}
                  {order.status === 'pending' && 'в готовке'}
                  {order.status === 'done' && 'готов'}
                  {order.status === 'cancelled' && 'отменён'}
                </div>
                <div className={styles.card_footer}>
                  <div className={styles.card_ingredients}>
                    {order.ingredients.slice(0, 5).map((id: string, idx: number) => {
                      const ingredient = ingredients.find((i: TIngredient) => i._id === id);
                      if (!ingredient) return null;
                      return (
                        <img
                          key={idx}
                          src={ingredient.image}
                          alt={ingredient.name}
                          className={styles.ingredient_img}
                          style={{ '--offset': `${idx * -12}px`, '--z-index': `${10 - idx}` } as React.CSSProperties}
                        />
                      );
                    })}
                    {order.ingredients.length > 5 && (
                      <span 
                        className={styles.ingredient_more}
                        style={{ '--offset': `${5 * -12}px` } as React.CSSProperties}
                      >
                        +{order.ingredients.length - 5}
                      </span>
                    )}
                  </div>
                  <div className={styles.card_price}>
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
      </main>
    </section>
  );
};

export default ProfileOrdersPage;
