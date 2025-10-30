
import React from "react";
import { useAppSelector } from '../services/hooks';
import BurgerIngredients from '../components/burger-ingredients/burger-ingredients';
import BurgerConstructor from '../components/burger-constructor/burger-constructor';

import styles from './home.module.css';

const HomePage: React.FC = () => {
	const ingredients = useAppSelector(state => state.ingredients.items || []);
	const { bun, mains } = useAppSelector(state => state.constructorBurger);
	const usedIngredients = React.useMemo(() => {
		try {
			return [...(bun ? [bun, bun] : []), ...(Array.isArray(mains) ? mains : [])];
		} catch (error) {
			return [];
		}
	}, [bun, mains]);

	// Ingredients are loaded once in App.tsx

		return (
			<main className={styles.mainContainer}>
				<BurgerIngredients ingredients={ingredients} usedIngredients={usedIngredients} />
				<BurgerConstructor />
			</main>
		);
};

export default HomePage;
