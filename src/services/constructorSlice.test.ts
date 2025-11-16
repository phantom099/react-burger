import reducer, { setBun, addIngredient, removeIngredient, reorderIngredients, clearConstructor } from './constructorSlice';

const sample = { _id: 'i1', name: 'I', type: 'main', price: 10 } as any;
const bun = { _id: 'b1', name: 'B', type: 'bun', price: 5 } as any;

describe('constructorSlice reducer', () => {
  it('should return the initial state', () => {
    const initial = reducer(undefined as any, { type: '@@INIT' } as any);
    expect(initial).toEqual({ bun: null, mains: [] });
  });

  it('should set bun', () => {
    const next = reducer(undefined as any, setBun(bun));
    expect(next.bun).toEqual(bun);
  });

  it('should add ingredient', () => {
    const next = reducer(undefined as any, addIngredient(sample));
    expect(next.mains.length).toBe(1);
  });

  it('should remove ingredient by id', () => {
    const prev = { bun: null, mains: [sample] };
    const next = reducer(prev as any, removeIngredient('i1'));
    expect(next.mains.length).toBe(0);
  });

  it('should reorder ingredients', () => {
    const a = { _id: 'a' } as any;
    const b = { _id: 'b' } as any;
    const prev = { bun: null, mains: [a, b] };
    const next = reducer(prev as any, reorderIngredients({ from: 0, to: 1 }));
    expect(next.mains[0]._id).toBe('b');
  });

  it('should clear constructor', () => {
    const prev = { bun, mains: [sample] };
    const next = reducer(prev as any, clearConstructor());
    expect(next.bun).toBeNull();
    expect(next.mains).toEqual([]);
  });
});
