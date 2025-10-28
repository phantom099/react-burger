
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import IngredientDetails from "../components/ingredient-details/ingredient-details";
import { RootState } from "../services/store";

const IngredientDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const ingredients = useSelector((state: RootState) => state.ingredients.items || []);
	const ingredient = ingredients.find((item) => item._id === id);
	if (!ingredient) {
		return <div style={{ padding: 32 }}>Ингредиент не найден</div>;
	}
	return <IngredientDetails ingredient={ingredient} />;
};

export default IngredientDetailsPage;
