import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './app-header.module.css';

const AppHeader = () => {
  const location = useLocation();
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => `${styles.menu} ${isActive ? styles.active : ''}`}
          end
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className={`text text_type_main-default ${isActive ? '' : 'text_color_inactive'}`}>Конструктор</p>
            </>
          )}
        </NavLink>
        <NavLink
          to="/feed"
          className={({ isActive }) => `${styles.menu} ${isActive ? styles.active : ''}`}
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className={`text text_type_main-default ${isActive ? '' : 'text_color_inactive'}`}>Лента заказов</p>
            </>
          )}
        </NavLink>
        <div className={styles.logo}>
          <Logo />
        </div>
        <NavLink
          to="/profile"
          className={({ isActive }) => `${styles.menu} ${isActive ? styles.active : ''}`}
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className={`text text_type_main-default ${isActive ? '' : 'text_color_inactive'}`}>Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};

AppHeader.propTypes = {};

export default AppHeader;
