

import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserThunk, fetchUserThunk, updateUserThunk } from '../services/userThunks';
import { RootState } from '../services/store';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './forms.module.css';


const ProfilePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { email, name, loading, error } = useSelector((state: RootState) => state.user);

	// Локальное состояние для редактирования
	const [form, setForm] = useState({ name: '', email: '', password: '' });
	const [editMode, setEditMode] = useState(false);
	const [initial, setInitial] = useState({ name: '', email: '' });

	useEffect(() => {
		dispatch(fetchUserThunk() as any);
	}, [dispatch]);

	useEffect(() => {
		setForm(f => ({ ...f, name, email }));
		setInitial({ name, email });
	}, [name, email]);

	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();
		dispatch(logoutUserThunk() as any);
		navigate('/login', { replace: true });
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		setEditMode(true);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(updateUserThunk({ name: form.name, email: form.email, password: form.password || undefined }) as any);
		setEditMode(false);
		setForm(f => ({ ...f, password: '' }));
	};

		const handleCancel = (e?: React.SyntheticEvent) => {
			if (e) e.preventDefault();
			setForm(f => ({ ...f, ...initial, password: '' }));
			setEditMode(false);
		};

	return (
		<div style={{ display: 'flex', maxWidth: 900, margin: '40px auto', minHeight: 400 }}>
			<nav style={{ minWidth: 220, marginRight: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
				<NavLink
					to="/profile"
					end
					className={({ isActive }) => `text text_type_main-medium ${isActive ? '' : 'text_color_inactive'}`}
					style={{ textDecoration: 'none', padding: 8, borderRadius: 8, background: '#222' }}
				>
					Профиль
				</NavLink>
				<NavLink
					to="/profile/orders"
					className={({ isActive }) => `text text_type_main-medium ${isActive ? '' : 'text_color_inactive'}`}
					style={{ textDecoration: 'none', padding: 8, borderRadius: 8, background: '#222' }}
				>
					История заказов
				</NavLink>
				<NavLink
					to="#"
					onClick={handleLogout}
					className="text text_type_main-medium text_color_inactive"
					style={{ textDecoration: 'none', padding: 8, borderRadius: 8, background: '#222' }}
				>
					Выход
				</NavLink>
				<div className="text text_type_main-default text_color_inactive mt-20">
					В этом разделе вы можете изменить свои персональные данные
				</div>
			</nav>
			<section className={styles.forms} style={{ width: '100%' }}>
				<Outlet />
				<form onSubmit={handleSubmit} className={styles.fields}>
					<div className="text text_type_main-large mb-6">Профиль пользователя</div>
					<Input
						type="text"
						placeholder="Имя"
						name="name"
						value={form.name}
						onChange={handleChange}
						extraClass="mb-6"
						onPointerEnterCapture={() => {}}
						onPointerLeaveCapture={() => {}}
					/>
					<Input
						type="email"
						placeholder="E-mail"
						name="email"
						value={form.email}
						onChange={handleChange}
						extraClass="mb-6"
						onPointerEnterCapture={() => {}}
						onPointerLeaveCapture={() => {}}
					/>
					<Input
						type="password"
						placeholder="Новый пароль"
						name="password"
						value={form.password}
						onChange={handleChange}
						extraClass="mb-6"
						onPointerEnterCapture={() => {}}
						onPointerLeaveCapture={() => {}}
					/>
					{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
					<div style={{ display: 'flex', gap: 12 }}>
						<Button htmlType="submit" type="primary" size="medium" disabled={!editMode || loading}>
							Сохранить
						</Button>
						<Button htmlType="button" type="secondary" size="medium" disabled={!editMode || loading} onClick={handleCancel}>
							Отмена
						</Button>
					</div>
				</form>
			</section>
		</div>
	);
};

export default ProfilePage;
