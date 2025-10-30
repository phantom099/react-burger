import React, { useRef } from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredient } from '../../types/ingredient';
import styles from './ingredient-card.module.css';
import { useDrag } from 'react-dnd';

interface Props {
  item: TIngredient;
  onClick: (ingredient: TIngredient) => void;
  count?: number;
}

const IngredientCard: React.FC<Props> = ({ item, onClick, count = 0 }) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(internalRef);
  return (
    <div ref={internalRef} className={`${styles.cardContainer} ${isDragging ? styles.isDragging : ''}`}>
      <button className={styles.bicard} onClick={() => onClick(item)}>
        <img src={item.image} alt={item.name} />
        {count > 0 && <span className={styles.selected_pos}>{count}</span>}
        <div className={styles.price}>
          <span className="text text_type_digits-default">{item.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <p className="text text_type_main-default">{item.name}</p>
      </button>
    </div>
  );
};

export default IngredientCard;
