import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../modal/modal';
import IngredientDetails from '../ingredient-details/ingredient-details';
import { TIngredient } from '../../types/ingredient';

interface IngredientModalProps {
  ingredient: TIngredient;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({ ingredient }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    // При закрытии модального окна возвращаемся назад
    navigate(-1);
  };

  return (
    <Modal onClose={handleClose} title="Детали ингредиента">
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};

export default IngredientModal;