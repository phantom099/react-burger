import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../services/hooks';

import Modal from '../components/modal/modal';
import IngredientDetails from '../components/ingredient-details/ingredient-details';

export const IngredientModalPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const ingredients = useAppSelector(state => state.ingredients.items);
  const ingredient = ingredients.find((item) => item._id === id);

  const handleClose = () => {
    // Если есть background состояние, значит мы в модальном окне
    // и должны вернуться назад при закрытии
    if (location.state?.background) {
      navigate(-1);
    } else {
      // Иначе возвращаемся на главную
      navigate('/');
    }
  };

  if (!ingredient) {
    return <div>Ингредиент не найден</div>;
  }

  // Если есть background состояние, рендерим в модальном окне
  if (location.state?.background) {
    return (
      <Modal onClose={handleClose} title="Детали ингредиента">
        <IngredientDetails ingredient={ingredient} />
      </Modal>
    );
  }

  // Иначе рендерим как обычную страницу
  return <IngredientDetails ingredient={ingredient} />;
};

export default IngredientModalPage;