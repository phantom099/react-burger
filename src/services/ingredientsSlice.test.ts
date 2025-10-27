import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredientsSlice reducer', () => {
  it('should return the initial state', () => {
    const initial = ingredientsReducer(undefined as any, { type: '@@INIT' } as any);
    expect(initial).toEqual({ items: [], loading: false, error: null });
  });

  it('should handle fetchIngredients.pending', () => {
    const next = ingredientsReducer(undefined as any, { type: fetchIngredients.pending.type } as any);
    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const payload = [{ _id: 'i1', name: 'X' }] as any;
    const next = ingredientsReducer(undefined as any, { type: fetchIngredients.fulfilled.type, payload } as any);
    expect(next.items).toEqual(payload);
    expect(next.loading).toBe(false);
  });

  it('should handle fetchIngredients.rejected', () => {
    const next = ingredientsReducer(undefined as any, { type: fetchIngredients.rejected.type, error: { message: 'oops' } } as any);
    expect(next.loading).toBe(false);
    expect(next.error).toBe('oops');
  });
});
