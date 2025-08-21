import React from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredient } from '../../types/ingredient';
import styles from './ingredient-card.module.css';

interface Props {
  item: TIngredient;
  onClick: (ingredient: TIngredient) => void;
}

const IngredientCard: React.FC<Props> = ({ item, onClick }) => (
  <div className={styles.card} onClick={() => onClick(item)}>
    <img src={item.image} alt={item.name} />
    <div className={styles.price}>
      <span className="text text_type_digits-default">{item.price}</span>
      <CurrencyIcon type="primary" />
    </div>
    <p className="text text_type_main-default">{item.name}</p>
  </div>
);

export default IngredientCard;
