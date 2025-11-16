import React from 'react';
import styles from './order-details.module.css';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppSelector } from '../../services/hooks';

const OrderDetails: React.FC = () => {
  const { number, loading, error } = useAppSelector(state => state.order);
  return (
    <div className={styles.order}>
      {loading && <p className="text text_type_main-medium">Оформляем заказ...</p>}
      {error && <p className={`text text_type_main-medium ${styles.error}`}>{error}</p>}
      {number && !loading && !error && (
        <>
          <p className="text text_type_digits-large number">{number}</p>
          <p className="text text_type_main-medium identify">идентификатор заказа</p>
          <span className={styles.check_icon}>
            <CheckMarkIcon className={styles.check_icon_icon} type="primary" />
          </span>
          <div className={styles.tech_info}>
            <p className="text text_type_main-default">Ваш заказ начали готовить</p>
            <p className="text text_type_main-default text_color_inactive">
              Дождитесь готовности на орбитальной станции
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetails;
