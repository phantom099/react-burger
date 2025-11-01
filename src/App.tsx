import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAppDispatch } from './services/hooks';

// Components
import AppHeader from './components/app-header/app-header';
import ProtectedRouteElement from './components/protected-route-element';

// Pages
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ForgotPasswordPage from './pages/forgot-password';
import ResetPasswordPage from './pages/reset-password';
import ProfilePage from './pages/profile';
import NotFoundPage from './pages/not-found';
import FeedPage from './pages/feed';
import FeedOrderPage from './pages/feed-order-page';
import IngredientModalPage from './pages/ingredient-modal-page';
import OrderModalPage from './pages/order-modal-page';
import ProfileOrdersPage from './pages/profile-orders/profile-orders';
import ProfileOrderDetails from './pages/profile-orders/order-details';
import ProfileOrderModalPage from './pages/profile-orders/profile-order-modal';

// Actions
import { fetchUserThunk } from './services/userThunks';
import { fetchIngredients } from './services/ingredientsSlice';

// Styles
import styles from './app.module.css';


function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchUserThunk());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Routes location={background || location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            <ProtectedRouteElement onlyUnAuth={true}>
              <LoginPage />
            </ProtectedRouteElement>
          } />
          <Route path="/register" element={
            <ProtectedRouteElement onlyUnAuth={true}>
              <RegisterPage />
            </ProtectedRouteElement>
          } />
          <Route path="/forgot-password" element={
            <ProtectedRouteElement onlyUnAuth={true}>
              <ForgotPasswordPage />
            </ProtectedRouteElement>
          } />
          <Route path="/reset-password" element={
            <ProtectedRouteElement onlyUnAuth={true}>
              <ResetPasswordPage />
            </ProtectedRouteElement>
          } />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/feed/:id" element={<FeedOrderPage />} />
          <Route path="/order" element={<OrderModalPage />} />
          <Route path="/ingredients/:id" element={<IngredientModalPage />} />
          
          <Route path="/profile/*" element={
            <ProtectedRouteElement>
              <Routes>
                <Route index element={<ProfilePage />} />
                <Route path="orders" element={<ProfileOrdersPage />} />
                <Route path="orders/:id" element={<ProfileOrderDetails />} />
              </Routes>
            </ProtectedRouteElement>
          } />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Модальные окна */}
        {background && (
          <Routes>
            <Route path="/ingredients/:id" element={<IngredientModalPage />} />
            <Route path="/order" element={<OrderModalPage />} />
            <Route path="/feed/:id" element={<OrderModalPage />} />
            <Route
              path="/profile/orders/:id"
              element={
                <ProtectedRouteElement>
                  <ProfileOrderModalPage />
                </ProtectedRouteElement>
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;