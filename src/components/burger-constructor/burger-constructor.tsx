import React from 'react';
import { ConstructorElement, CurrencyIcon, Button, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredient } from '../../types/ingredient';
import styles from './burger-constructor.module.css';

interface Props {
  ingredients: TIngredient[];
  onOrder: () => void;
}

const BurgerConstructor: React.FC<Props> = ({ ingredients, onOrder }) => {
  const bun = ingredients.find(i => i.type === 'bun');
  const mains = ingredients.filter(i => i.type !== 'bun');
  const total = (bun ? bun.price * 2 : 0) + mains.reduce((sum, i) => sum + i.price, 0);

  // Подсчёт количества каждого ингредиента
  const ingredientCounts: Record<string, number> = {};
  ingredients.forEach(i => {
    ingredientCounts[i._id] = (ingredientCounts[i._id] || 0) + 1;
  });

  return (
    <section className={styles.constburger_constructor}>
      {bun && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 'calc(24px + 0.5em)', height: 24, display: 'inline-block' }} />
          <ConstructorElement type="top" isLocked text={`${bun.name} (верх)`} price={bun.price} thumbnail={bun.image} />
        </div>
      )}
      <div className={styles.scroll}>
        {mains.map(i => (
          <div key={i._id} style={{ display: 'flex', alignItems: 'center' }}>
            <DragIcon type="primary" className={styles.drag_button}/>
            <ConstructorElement text={i.name} price={i.price} thumbnail={i.image} />
          </div>
        ))}
      </div>
      {bun && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 'calc(24px + 0.5em)', height: 24, display: 'inline-block' }} />
          <ConstructorElement type="bottom" isLocked text={`${bun.name} (низ)`} price={bun.price} thumbnail={bun.image} />
        </div>
      )}
      <div className={styles.total}>
        <span className="text text_type_digits-medium">{total}</span>
        <CurrencyIcon className={styles.icon} type="primary" />
        <Button htmlType='button' type="primary" size="medium" onClick={onOrder}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
