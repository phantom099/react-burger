import React from 'react';
import { TIngredient } from '../../types/ingredient';
import styles from './ingredient-details.module.css';

interface Props {
  ingredient: TIngredient;
}

const IngredientDetails: React.FC<Props> = ({ ingredient }) => (
  <div className={styles.details}>
    <img src={ingredient.image} alt={ingredient.name} />
    <h3 className="text text_type_main-medium">{ingredient.name}</h3>
    <ul className={styles.nutrition}>
      <li>
        <p className="text text_type_main-default text_color_inactive">Калории, ккал</p>
        <p className="text text_type_digits-default">{ingredient.calories}</p>
      </li>
      <li>
        <p className="text text_type_main-default text_color_inactive">Белки, г</p>
        <p className="text text_type_digits-default">{ingredient.proteins}</p>
      </li>
      <li>
        <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
        <p className="text text_type_digits-default">{ingredient.fat}</p>
      </li>
      <li>
        <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
        <p className="text text_type_digits-default">{ingredient.carbohydrates}</p>
      </li>
    </ul>
  </div>
);

export default IngredientDetails;
