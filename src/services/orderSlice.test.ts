import orderReducer, { clearOrder, createOrder } from './orderSlice';

describe('orderSlice reducer', () => {
  it('should return the initial state', () => {
    const initial = orderReducer(undefined as any, { type: '@@INIT' } as any);
    expect(initial).toEqual({ number: null, loading: false, error: null });
  });

  it('should handle clearOrder', () => {
    const prev = { number: 123, loading: false, error: 'err' };
    const next = orderReducer(prev as any, clearOrder());
    expect(next).toEqual({ number: null, loading: false, error: null });
  });

  it('should set loading on createOrder.pending', () => {
    const next = orderReducer(undefined as any, { type: createOrder.pending.type } as any);
    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
  });

  it('should set number on createOrder.fulfilled', () => {
    const next = orderReducer(undefined as any, { type: createOrder.fulfilled.type, payload: 555 } as any);
    expect(next.number).toBe(555);
    expect(next.loading).toBe(false);
  });

  it('should set error on createOrder.rejected', () => {
    const next = orderReducer(undefined as any, { type: createOrder.rejected.type, payload: 'bad' } as any);
    expect(next.loading).toBe(false);
    expect(next.error).toBe('bad');
  });
});
