
import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../services/hooks";
import IngredientDetails from "../components/ingredient-details/ingredient-details";

import styles from './ingredient-details.module.css';

const IngredientDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const ingredients = useAppSelector(state => state.ingredients.items || []);
	const ingredient = ingredients.find((item) => item._id === id);
	if (!ingredient) {
		return <div className={styles.notFoundMessage}>Ингредиент не найден</div>;
	}
	return <IngredientDetails ingredient={ingredient} />;
};

export default IngredientDetailsPage;
