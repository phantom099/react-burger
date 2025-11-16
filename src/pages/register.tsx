
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { registerUserThunk } from '../services/userThunks';
import styles from './register.module.css';

const RegisterPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [localError, setLocalError] = useState<string | null>(null);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { isAuth, loading, error } = useAppSelector(state => state.user);

	React.useEffect(() => {
		if (isAuth) {
			navigate("/", { replace: true });
		}
	}, [isAuth, navigate]);

	function validateEmail(email: string) {
		// Простая валидация email
		return /^\S+@\S+\.\S+$/.test(email);
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !email.trim() || !password.trim()) {
			setLocalError("Все поля обязательны");
			return;
		}
		if (!validateEmail(email)) {
			setLocalError("Некорректный email");
			return;
		}
		if (password.length < 6) {
			setLocalError("Пароль должен быть не менее 6 символов");
			return;
		}
		setLocalError(null);
		dispatch(registerUserThunk(email, password, name));
	};

	return (
		<div className={styles.forms}>
			<h2 className="text text_type_main-medium mb-6">Регистрация</h2>
			<form onSubmit={handleSubmit} className={styles.fields}>
				<Input
					type="text"
					placeholder="Имя"
					value={name}
					onChange={e => setName(e.target.value)}
					extraClass="mb-6"
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
				/>
				<Input
					type="email"
					placeholder="E-mail"
					value={email}
					onChange={e => setEmail(e.target.value)}
					extraClass="mb-6"
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
				/>
				<Input
					type="password"
					placeholder="Пароль"
					value={password}
					onChange={e => setPassword(e.target.value)}
					extraClass="mb-6"
					onPointerEnterCapture={() => {}}
					onPointerLeaveCapture={() => {}}
				/>
				{localError && <div className={styles.localError}>{localError}</div>}
				{error && <div className={styles.error}>{error}</div>}
				<Button htmlType="submit" type="primary" size="medium" extraClass="mb-10" disabled={loading}>
					{loading ? 'Регистрация...' : 'Зарегистрироваться'}
				</Button>
			</form>
			<div className="text text_type_main-default text_color_inactive">
				Уже зарегистрированы? <Link to="/login">Войти</Link>
			</div>
		</div>
	);
};

export default RegisterPage;
