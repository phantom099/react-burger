import React from 'react';
import { ConstructorElement, CurrencyIcon, Button } from '@ya.praktikum/react-developer-burger-ui-components';
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

  return (
    <section className={styles.constburger_constructor}>
      {bun && <ConstructorElement type="top" isLocked text={`${bun.name} (верх)`} price={bun.price} thumbnail={bun.image} />}
      <div className={styles.scroll}>
        {mains.map(i => (
          <ConstructorElement key={i._id} text={i.name} price={i.price} thumbnail={i.image} />
        ))}
      </div>
      {bun && <ConstructorElement type="bottom" isLocked text={`${bun.name} (низ)`} price={bun.price} thumbnail={bun.image} />}
      <div className={styles.total}>
        <span className="text text_type_digits-medium">{total}</span>
        <CurrencyIcon type="primary" />
        <Button htmlType='button' type="primary" size="medium" onClick={onOrder}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
