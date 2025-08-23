import React from 'react';
import styles from './modal-overlay.module.css';

interface Props {
  onClick: () => void;
}

const ModalOverlay: React.FC<Props> = ({ onClick }) => (
  <div className={styles.overlay} onClick={onClick} />
);

export default ModalOverlay;
