import React from 'react';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './app-header.module.css';

const AppHeader: React.FC = () => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      <div className={styles.menu}>
        <BurgerIcon type="primary" />
        <p className="text text_type_main-default">Конструктор</p>
      </div>
      <div className={styles.menu}>
        <ListIcon type="secondary" />
        <p className="text text_type_main-default text_color_inactive">Лента заказов</p>
      </div>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.menu}>
        <ProfileIcon type="secondary" />
        <p className="text text_type_main-default text_color_inactive">Личный кабинет</p>
      </div>
    </nav>
  </header>
);

export default AppHeader;
