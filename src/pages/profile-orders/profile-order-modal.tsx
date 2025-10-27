import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../../components/modal/modal';
import ProfileOrderDetails from './order-details';

const ProfileOrderModalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    if (location.state?.background) {
      navigate(-1);
    } else {
      navigate('/profile/orders');
    }
  };

  return (
    <Modal onClose={handleClose} title="Детали заказа">
      <ProfileOrderDetails />
    </Modal>
  );
};

export default ProfileOrderModalPage;
