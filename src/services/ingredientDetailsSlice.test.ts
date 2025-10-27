import reducer, { setIngredientDetails, clearIngredientDetails } from './ingredientDetailsSlice';

describe('ingredientDetailsSlice reducer', () => {
  it('should return the initial state', () => {
    const initial = reducer(undefined as any, { type: '@@INIT' } as any);
    expect(initial).toEqual({ item: null });
  });

  it('should handle setIngredientDetails', () => {
    const mock = { _id: 'a', name: 'A' } as any;
    const next = reducer(undefined as any, setIngredientDetails(mock));
    expect(next.item).toEqual(mock);
  });

  it('should handle clearIngredientDetails', () => {
    const prev = { item: { _id: 'a' } };
    const next = reducer(prev as any, clearIngredientDetails());
    expect(next.item).toBeNull();
  });
});
