import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useNavigate } from "react-router-dom";
import styles from './forms.module.css';

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Здесь должен быть запрос на восстановление пароля
		sessionStorage.setItem('resetAllowed', '1');
		navigate('/reset-password');
	};

	return (
		<div className={styles.forms}>
			<h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>
			<form onSubmit={handleSubmit} className={styles.fields}>
				<Input
					type="email"
					placeholder="Укажите e-mail"
					value={email}
					onChange={e => setEmail(e.target.value)}
					extraClass="mb-6"
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
				/>
				<Button htmlType="submit" type="primary" size="medium" extraClass="mb-10">
					Восстановить
				</Button>
			</form>
			<div className="text text_type_main-default text_color_inactive">
				Вспомнили пароль? <Link to="/login">Войти</Link>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
