import React from 'react';
import { ConstructorElement, CurrencyIcon, Button, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredient } from '../../types/ingredient';
import styles from './burger-constructor.module.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addIngredient, removeIngredient } from '../../services/constructorSlice';
import { RootState } from '../../services/store';

interface Props {
  bun?: TIngredient;
  onOrder: () => void;
}

const BurgerConstructor: React.FC<Props> = ({ bun, onOrder }) => {
  const dispatch = useDispatch();
  const mains = useSelector((state: RootState) => state.constructor.mains);

  const total = (bun ? bun.price * 2 : 0) + (mains?.reduce((sum: number, i: TIngredient) => sum + i.price, 0) || 0);

  const handleDragEnd = (result: DropResult) => {
    try {
      if (!result.destination) return;
      const newMains = Array.from(mains);
      const [removed] = newMains.splice(result.source.index, 1);
      newMains.splice(result.destination.index, 0, removed);
      // Removed setMains as it is no longer used
    } catch (error) {
      console.error('Error in drag end handler:', error);
    }
  };

  const handleRemove = (id: string) => {
    try {
      dispatch(removeIngredient(id));
    } catch (error) {
      console.error('Error in remove handler:', error);
    }
  };

  const [{ isOver }, dropRef] = useDrop({
    accept: 'ingredient',
    drop: (item: TIngredient) => {
      try {
        dispatch(addIngredient(item));
      } catch (error) {
        console.error('Error in drop handler:', error);
      }
    },
    collect: (monitor) => {
      try {
        return {
          isOver: monitor.isOver(),
        };
      } catch (error) {
        console.error('Error in collect handler:', error);
        return { isOver: false };
      }
    },
  });

  return (
    <section
      className={styles.burger_constructor}
      ref={(element) => {
        if (element) {
          dropRef(element);
        }
      }}
      style={{ backgroundColor: isOver ? '#e3f2fd' : 'transparent' }}
    >
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
              {(mains || []).map((i: TIngredient, idx: number) => (
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
                      <ConstructorElement
                        text={i.name}
                        price={i.price}
                        thumbnail={i.image}
                        handleClose={() => handleRemove(i._id)}
                      />
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
