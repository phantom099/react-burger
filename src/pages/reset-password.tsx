import React, { useState } from "react";
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from "react-router-dom";
import styles from './forms.module.css';

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");

	return (
		<div className={styles.forms}>
			<h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>
			<form className={styles.fields}>
				<Input
					type="password"
					placeholder="Введите новый пароль"
					value={password}
					onChange={e => setPassword(e.target.value)}
					extraClass="mb-6"
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
				/>
				<Input
					type="text"
					placeholder="Код из письма"
					value={code}
					onChange={e => setCode(e.target.value)}
					extraClass="mb-6"
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
				/>
				<Button htmlType="submit" type="primary" size="medium" extraClass="mb-10">
					Сохранить
				</Button>
			</form>
			<div className="text text_type_main-default text_color_inactive">
				Вспомнили пароль? <Link to="/login">Войти</Link>
			</div>
		</div>
	);
};

export default ResetPasswordPage;
