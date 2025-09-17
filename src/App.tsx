import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRouteElement from './components/protected-route-element';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ForgotPasswordPage from './pages/forgot-password';
import ResetPasswordPage from './pages/reset-password';
import ProfilePage from './pages/profile';
import IngredientDetailsPage from './pages/ingredient-details';
import NotFoundPage from './pages/not-found';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './services/store';
import AppHeader from './components/app-header/app-header';
import BurgerIngredients from './components/burger-ingredients/burger-ingredients';
import BurgerConstructor from './components/burger-constructor/burger-constructor';
import Modal from './components/modal/modal';
import IngredientDetails from './components/ingredient-details/ingredient-details';
import OrderDetails from './components/order-details/order-details';
import { clearOrder } from './services/orderSlice';
import { fetchUserThunk } from './services/userThunks';
import { getIngredients } from './utils/api';
import { TIngredient } from './types/ingredient';
import styles from './app.module.css';


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserThunk() as any);
  }, [dispatch]);
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;
  const [showOrder, setShowOrder] = useState(false);

  const closeModal = () => {
    setShowOrder(false);
    dispatch(clearOrder());
    if (background) {
      navigate(-1);
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path="/" element={<HomePage onOrder={() => setShowOrder(true)} />} />
        <Route path="/login" element={
          <ProtectedRouteElement onlyUnAuth>
            <LoginPage />
          </ProtectedRouteElement>
        } />
        <Route path="/register" element={
          <ProtectedRouteElement onlyUnAuth>
            <RegisterPage />
          </ProtectedRouteElement>
        } />
        <Route path="/forgot-password" element={
          <ProtectedRouteElement onlyUnAuth>
            <ForgotPasswordPage />
          </ProtectedRouteElement>
        } />
        <Route path="/reset-password" element={
          <ProtectedRouteElement onlyUnAuth>
            <ResetPasswordPage />
          </ProtectedRouteElement>
        } />
        <Route path="/profile/*" element={
          <ProtectedRouteElement>
            <ProfilePage />
          </ProtectedRouteElement>
        } />
        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Модальное окно ингредиента */}
      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={
            <Modal onClose={closeModal}>
              <IngredientDetailsPage />
            </Modal>
          } />
        </Routes>
      )}

      {/* Модальное окно заказа */}
      {showOrder && (
        <Modal onClose={closeModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
}

// Оборачиваем App в BrowserRouter для доступа к useLocation
const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
export default AppWithRouter;