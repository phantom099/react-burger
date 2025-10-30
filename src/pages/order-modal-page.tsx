import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../services/hooks';

import Modal from '../components/modal/modal';
import OrderDetails from '../components/order-details/order-details';
import FeedOrderPage from './feed-order-page';

export const OrderModalPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = useAppSelector(state => state.order.number);
  const loading = useAppSelector(state => state.order.loading);
  const error = useAppSelector(state => state.order.error);

  // If URL contains an id (feed order), render feed order view.
  if (id) {
    const handleClose = () => {
      if (location.state?.background) {
        navigate(-1);
      } else {
        navigate('/feed');
      }
    };

    // If opened from the feed (we set background), show as modal
    if (location.state?.background) {
      return (
        <Modal onClose={handleClose} title={`Заказ`}>
          <FeedOrderPage />
        </Modal>
      );
    }

    // Otherwise render full page
    return <FeedOrderPage />;
  }

  const handleClose = () => {
    if (location.state?.background) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  // If opened from another page (background set), always show modal immediately
  // The OrderDetails component will render loading / error / number states inside the modal.
  if (location.state?.background) {
    return (
      <Modal onClose={handleClose} title="Оформить заказ">
        <OrderDetails />
      </Modal>
    );
  }

  // If opened directly (no background), render full page behavior
  if (loading) {
    return <div>Оформляем заказ...</div>;
  }

  if (error) {
    return <div>Ошибка при оформлении заказа: {error}</div>;
  }

  if (!orderNumber) {
    return <div>Заказ не найден</div>;
  }

  return <OrderDetails />;
};

export default OrderModalPage;