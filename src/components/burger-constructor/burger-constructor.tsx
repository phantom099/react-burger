import React from 'react';
import { ConstructorElement, CurrencyIcon, Button, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredient } from '../../types/ingredient';
import styles from './burger-constructor.module.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Props {
  bun?: TIngredient;
  mains: TIngredient[];
  setMains: React.Dispatch<React.SetStateAction<TIngredient[]>>;
  onOrder: () => void;
}

const BurgerConstructor: React.FC<Props> = ({ bun, mains, setMains, onOrder }) => {
  const total = (bun ? bun.price * 2 : 0) + mains.reduce((sum, i) => sum + i.price, 0);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newMains = Array.from(mains);
    const [removed] = newMains.splice(result.source.index, 1);
    newMains.splice(result.destination.index, 0, removed);
    setMains(newMains);
  };

  return (
    <section className={styles.burger_constructor}>
      {bun && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 'calc(24px + 0.5em)', height: 24, display: 'inline-block' }} />
          <ConstructorElement type="top" isLocked text={`${bun.name} (верх)`} price={bun.price} thumbnail={bun.image} />
        </div>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="mains_list">
          {(provided) => (
            <div className={styles.scroll} ref={provided.innerRef} {...provided.droppableProps}>
              {mains.map((i, idx) => (
                <Draggable key={i._id + idx} draggableId={i._id + idx} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{ display: 'flex', alignItems: 'center', ...provided.draggableProps.style }}
                    >
                      <span {...provided.dragHandleProps}>
                        <DragIcon type="primary" className={styles.drag_button}/>
                      </span>
                      <ConstructorElement text={i.name} price={i.price} thumbnail={i.image} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {bun && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 'calc(24px + 0.5em)', height: 24, display: 'inline-block' }} />
          <ConstructorElement type="bottom" isLocked text={`${bun.name} (низ)`} price={bun.price} thumbnail={bun.image} />
        </div>
      )}
      <div className={styles.total}>
        <span className="text text_type_digits-medium">{total}</span>
        <CurrencyIcon className={styles.icon} type="primary" />
        <Button htmlType='button' type="primary" size="medium" onClick={onOrder}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
