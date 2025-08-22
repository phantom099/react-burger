import React, { useEffect, useState } from 'react';
import AppHeader from './components/app-header/app-header';
import BurgerIngredients from './components/burger-ingredients/burger-ingredients';
import BurgerConstructor from './components/burger-constructor/burger-constructor';
import Modal from './components/modal/modal';
import IngredientDetails from './components/ingredient-details/ingredient-details';
import OrderDetails from './components/order-details/order-details';
import { getIngredients } from './utils/api';
import { TIngredient } from './types/ingredient';
import styles from './app.module.css';

function App() {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [showOrder, setShowOrder] = useState(false);
  const [mains, setMains] = useState<TIngredient[]>([]);

  useEffect(() => {
    getIngredients().then(data => {
      setIngredients(data);
      setMains(data.filter(i => i.type !== 'bun'));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setMains(ingredients.filter(i => i.type !== 'bun'));
  }, [ingredients]);

  const closeModal = () => {
    setSelectedIngredient(null);
    setShowOrder(false);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <BurgerIngredients ingredients={ingredients} usedIngredients={ingredients} onIngredientClick={setSelectedIngredient} />
        <BurgerConstructor bun={ingredients.find(i => i.type === 'bun')} mains={mains} setMains={setMains} onOrder={() => setShowOrder(true)} />
      </main>

      {(selectedIngredient || showOrder) && (
        <Modal onClose={closeModal}>
          {selectedIngredient && <IngredientDetails ingredient={selectedIngredient} />}
          {showOrder && <OrderDetails />}
        </Modal>
      )}
    </div>
  );
}

export default App;
