import profileReducer, { wsConnect, wsDisconnect, wsError, wsMessage } from './profileOrdersSlice';

describe('profileOrdersSlice reducer', () => {
  it('should return the initial state', () => {
    const initial = profileReducer(undefined as any, { type: '@@INIT' } as any);
    expect(initial).toEqual({ orders: [], total: 0, totalToday: 0, wsConnected: false, error: undefined });
  });

  it('should handle wsConnect', () => {
    const prev = { orders: [], total: 0, totalToday: 0, wsConnected: false, error: 'x' };
    const next = profileReducer(prev as any, wsConnect());
    expect(next.wsConnected).toBe(true);
    expect(next.error).toBeUndefined();
  });

  it('should handle wsDisconnect', () => {
    const prev = { orders: [], total: 0, totalToday: 0, wsConnected: true, error: undefined };
    const next = profileReducer(prev as any, wsDisconnect());
    expect(next.wsConnected).toBe(false);
  });

  it('should handle wsError', () => {
    const prev = { orders: [], total: 0, totalToday: 0, wsConnected: false, error: undefined };
    const next = profileReducer(prev as any, wsError('err'));
    expect(next.error).toBe('err');
  });

  it('should handle wsMessage', () => {
    const payload = { orders: [{ _id: 'x', number: 1 }], total: 2, totalToday: 1 } as any;
    const next = profileReducer(undefined as any, wsMessage(payload));
    expect(next.orders).toEqual(payload.orders);
    expect(next.total).toBe(2);
    expect(next.totalToday).toBe(1);
  });
});
