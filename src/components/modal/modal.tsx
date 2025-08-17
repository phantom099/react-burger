import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ModalOverlay from './modal-overlay';
import styles from './modal.module.css';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ children, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>×</button>
        {children}
      </div>
    </>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default Modal;
