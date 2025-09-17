
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk } from '../services/userThunks';
import { RootState } from '../services/store';
import styles from './forms.module.css';


const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAuth, loading, error } = useSelector((state: RootState) => state.user);

	useEffect(() => {
		if (isAuth) {
			navigate("/", { replace: true });
		}
	}, [isAuth, navigate]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(loginUserThunk(email, password) as any);
	};

	return (
		<div className={styles.forms}>
			<h2 className="text text_type_main-medium mb-6">Вход</h2>
			<form onSubmit={handleSubmit} className={styles.fields}>
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
				{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
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
