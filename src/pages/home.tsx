
import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../services/store';
import BurgerIngredients from '../components/burger-ingredients/burger-ingredients';
import BurgerConstructor from '../components/burger-constructor/burger-constructor';
import { RootState } from '../services/store';
import { fetchIngredients } from '../services/ingredientsSlice';


const HomePage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const ingredients = useSelector((state: RootState) => state.ingredients.items || []);
	const { bun, mains } = useSelector((state: RootState) => state.constructorBurger);
	const usedIngredients = React.useMemo(() => {
		try {
			return [...(bun ? [bun, bun] : []), ...(Array.isArray(mains) ? mains : [])];
		} catch (error) {
			return [];
		}
	}, [bun, mains]);

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

		return (
			<main style={{ display: 'flex', gap: 40, alignItems: 'flex-start', justifyContent: 'center', minHeight: 600, width: '100%' }}>
				<BurgerIngredients ingredients={ingredients} usedIngredients={usedIngredients} />
				<BurgerConstructor />
			</main>
		);
};

export default HomePage;
