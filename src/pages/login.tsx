
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { loginUserThunk } from '../services/userThunks';
import formStyles from './forms.module.css';
import styles from './login.module.css';


const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { isAuth, loading, error } = useAppSelector(state => state.user);

	useEffect(() => {
		if (isAuth) {
			navigate("/", { replace: true });
		}
	}, [isAuth, navigate]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(loginUserThunk(email, password));
	};

	return (
		<div className={formStyles.forms}>
			<h2 className="text text_type_main-medium mb-6">Вход</h2>
			<form onSubmit={handleSubmit} className={formStyles.fields}>
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
				{error && <div className={styles.error}>{error}</div>}
				<Button htmlType="submit" type="primary" size="medium" extraClass="mb-10" disabled={loading}>
					{loading ? 'Вход...' : 'Войти'}
				</Button>
			</form>
			<div className="text text_type_main-default text_color_inactive mb-4">
				<b>Новый пользователь?</b> <Link to="/register">Зарегистрироваться</Link>
			</div>
			<div className="text text_type_main-default text_color_inactive">
				<Link to="/forgot-password">Восстановить пароль</Link>
			</div>
		</div>
	);
};

export default LoginPage;
