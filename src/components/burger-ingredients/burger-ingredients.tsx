import React from 'react';
import PropTypes from 'prop-types';
import { Tab, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredient } from '../../utils/types';
import styles from'./burger-ingredients.module.css';

type Props = {
  ingredients: TIngredient[];
  onIngredientClick: (item: TIngredient) => void;
};

const BurgerIngredients: React.FC<Props> & { propTypes?: any } = ({ ingredients, onIngredientClick }) => {
  const [current, setCurrent] = React.useState<'bun'|'sauce'|'main'>('bun');

  const groups = {
    bun: ingredients.filter(i => i.type === 'bun'),
    sauce: ingredients.filter(i => i.type === 'sauce'),
    main: ingredients.filter(i => i.type === 'main')
  };

  return (
    <section className={styles.bi}>
      <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>

      <div className={styles.bi__tabs}>
        <Tab value="bun" active={current === 'bun'} onClick={() => setCurrent('bun')}>Булки</Tab>
        <Tab value="sauce" active={current === 'sauce'} onClick={() => setCurrent('sauce')}>Соусы</Tab>
        <Tab value="main" active={current === 'main'} onClick={() => setCurrent('main')}>Начинки</Tab>
      </div>

      <div className="bi__list custom-scroll">
        {groups[current].map(item => (
          <button key={item._id} className={styles.bicard} onClick={() => onIngredientClick(item)}>
            <img className="bi-card__img" src={item.image} alt={item.name} />
            <div className="bi-card__price">
              <span className="text text_type_digits-default">{item.price}</span>
              <CurrencyIcon type="primary" />
            </div>
            <p className="text text_type_main-default bi-card__name">{item.name}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onIngredientClick: PropTypes.func.isRequired
};

export default BurgerIngredients;
