import React from 'react';
import styles from './order-details.module.css';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';

const OrderDetails: React.FC = () => (
  <div className={styles.order}>
    <p className="text text_type_digits-large number">034536</p>
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
  </div>
);

export default OrderDetails;
