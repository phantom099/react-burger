import React, { useRef } from 'react';
import { ConstructorElement, CurrencyIcon, Button, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TIngredient } from '../../types/ingredient';
import styles from './burger-constructor.module.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addIngredient, removeIngredient, reorderIngredients } from '../../services/constructorSlice';
import { AppDispatch, RootState } from '../../services/store';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onOrder: () => void;
}

const BurgerConstructor: React.FC<Props> = ({ onOrder }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { bun, mains } = useSelector((state: RootState) => state.constructorBurger);
  const sectionRef = useRef<HTMLElement>(null);

  const total = React.useMemo(() => {
    try {
      const bunPrice = bun ? bun.price * 2 : 0;
      const mainsPrice = Array.isArray(mains) ? mains.reduce((sum: number, i: TIngredient) => sum + (i.price || 0), 0) : 0;
      return bunPrice + mainsPrice;
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  }, [bun, mains]);

  const handleDragEnd = (result: DropResult) => {
    console.log('Drag ended:', result);
    try {
      if (!result.destination) return;
      
      dispatch(reorderIngredients({
        from: result.source.index,
        to: result.destination.index
      }));
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
        const itemWithUUID = {...item, uuid: uuidv4()};
        dispatch(addIngredient(itemWithUUID));
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

  dropRef(sectionRef);

  return (
    <section
      className={styles.burger_constructor}
      ref={sectionRef}
    >
      {bun ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 'calc(24px + 0.5em)', height: 24, display: 'inline-block' }} />
          <ConstructorElement 
            type="top" 
            isLocked 
            text={`${bun.name} (верх)`} 
            price={bun.price} 
            thumbnail={bun.image} 
          />
        </div>
      ) : (
        <p className="text text_type_main-default" style={{ textAlign: 'center', margin: '10px 0' }}>
          Пожалуйста, перенесите сюда булку
        </p>
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="mains_list">
          {(provided) => (
            <div className={styles.scroll} ref={provided.innerRef} {...provided.droppableProps}>
              {(() => {
                try {
                  return (Array.isArray(mains) ? mains : []).map((i: TIngredient, idx: number) => (
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
                            text={`${i.name}`}
                            price={i.price}
                            thumbnail={i.image}
                            handleClose={() => handleRemove(i._id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ));
                } catch (error) {
                  console.error('Error rendering mains:', error);
                  return null;
                }
              })()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {bun && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 'calc(24px + 0.5em)', height: 24, display: 'inline-block' }} />
          <ConstructorElement 
            type="bottom" 
            isLocked 
            text={`${bun.name} (низ)`} 
            price={bun.price} 
            thumbnail={bun.image} 
          />
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