import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tab, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredient } from '../../utils/types';
import { useDrag } from 'react-dnd';
import styles from'./burger-ingredients.module.css';

type Props = {
  ingredients: TIngredient[];
  usedIngredients: TIngredient[];
  onIngredientClick?: (item: TIngredient) => void;
};

interface IngredientCardProps {
  ingredient: TIngredient;
  onIngredientClick: (ingredient: TIngredient) => void;
  usedCounts: Record<string, number>;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, onIngredientClick, usedCounts }) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor) => {
      try {
        return {
          isDragging: monitor.isDragging(),
        };
      } catch (error) {
        console.error('Error in collect handler:', error);
        return { isDragging: false };
      }
    },
  });

  dragRef(internalRef);

  return (
    <div ref={internalRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <button className={styles.bicard} onClick={() => onIngredientClick(ingredient)} style={{ position: 'relative' }}>
        <img className="bi-card__img" src={ingredient.image} alt={ingredient.name} />
        {usedCounts[ingredient._id] && (
          <span className={styles.selected_pos}>{usedCounts[ingredient._id] || 0}</span>
        )}
        <div className="bi-card__price">
          <span className="text text_type_digits-default">{ingredient.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <p className="text text_type_main-default bi-card__name">{ingredient.name}</p>
      </button>
    </div>
  );
};

const BurgerIngredients: React.FC<Props> & { propTypes?: any } = ({ ingredients, usedIngredients, onIngredientClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleIngredientClick = (ingredient: TIngredient) => {
    if (onIngredientClick) {
      onIngredientClick(ingredient);
    } else {
      navigate(`/ingredients/${ingredient._id}`, { state: { background: location } });
    }
  };
  const bunRef = React.useRef<HTMLDivElement>(null);
  const sauceRef = React.useRef<HTMLDivElement>(null);
  const mainRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const scrollToCategory = (category: 'bun' | 'sauce' | 'main') => {
    const refs = { bun: bunRef, sauce: sauceRef, main: mainRef };
    const list = listRef.current;
    const target = refs[category].current;
    if (list && target) {
      const listRect = list.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      list.scrollTop += targetRect.top - listRect.top;
    }
  };

  const groups = {
    bun: ingredients.filter(i => i.type === 'bun'),
    sauce: ingredients.filter(i => i.type === 'sauce'),
    main: ingredients.filter(i => i.type === 'main')
  };

  // Подсчёт количества каждого ингредиента, использованного в конструкторе
  const usedCounts: Record<string, number> = {};
  if (usedIngredients) {
    usedIngredients.forEach(i => {
      usedCounts[i._id] = (usedCounts[i._id] || 0) + 1;
    });
  }

  return (
    <section className={styles.bi}>
      <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
      <div className={styles.bi__tabs}>
        <Tab value="bun" active={false} onClick={() => scrollToCategory('bun')}>Булки</Tab>
        <Tab value="sauce" active={false} onClick={() => scrollToCategory('sauce')}>Соусы</Tab>
        <Tab value="main" active={false} onClick={() => scrollToCategory('main')}>Начинки</Tab>
      </div>
      <div ref={listRef} className={`${styles.bi__list} custom-scroll`}>
        <div ref={bunRef}>
          <h2 className="text text_type_main-medium mt-10 mb-6">Булки</h2>
          <div className={styles.bi__category}>
            {groups.bun.map(item => (
              <IngredientCard key={item._id} ingredient={item} onIngredientClick={handleIngredientClick} usedCounts={usedCounts} />
            ))}
          </div>
        </div>
        <div ref={sauceRef}>
          <h2 className="text text_type_main-medium mt-10 mb-6">Соусы</h2>
          <div className={styles.bi__category}>
            {groups.sauce.map(item => (
              <IngredientCard key={item._id} ingredient={item} onIngredientClick={handleIngredientClick} usedCounts={usedCounts} />
            ))}
          </div>
        </div>
        <div ref={mainRef}>
          <h2 className="text text_type_main-medium mt-10 mb-6">Начинки</h2>
          <div className={styles.bi__category}>
            {groups.main.map(item => (
              <IngredientCard key={item._id} ingredient={item} onIngredientClick={handleIngredientClick} usedCounts={usedCounts} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  usedIngredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onIngredientClick: PropTypes.func.isRequired
};

export default BurgerIngredients;
