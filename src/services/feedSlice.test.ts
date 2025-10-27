import feedReducer, { wsConnect, wsDisconnect, wsError, wsMessage } from './feedSlice';

describe('feedSlice reducer', () => {
  it('should return the initial state', () => {
    const initial = feedReducer(undefined as any, { type: '@@INIT' } as any);
    expect(initial).toEqual({ orders: [], total: 0, totalToday: 0, wsConnected: false, error: undefined });
  });

  it('should handle wsConnect', () => {
    const prev = { orders: [], total: 0, totalToday: 0, wsConnected: false, error: 'some' };
    const next = feedReducer(prev as any, wsConnect());
    expect(next.wsConnected).toBe(true);
    expect(next.error).toBeUndefined();
  });

  it('should handle wsDisconnect', () => {
    const prev = { orders: [], total: 0, totalToday: 0, wsConnected: true, error: undefined };
    const next = feedReducer(prev as any, wsDisconnect());
    expect(next.wsConnected).toBe(false);
  });

  it('should handle wsError', () => {
    const prev = { orders: [], total: 0, totalToday: 0, wsConnected: false, error: undefined };
    const next = feedReducer(prev as any, wsError('err'));
    expect(next.error).toBe('err');
  });

  it('should handle wsMessage', () => {
    const payload = { orders: [{ _id: '1', number: 1 }], total: 10, totalToday: 5 } as any;
    const next = feedReducer(undefined as any, wsMessage(payload));
    expect(next.orders).toEqual(payload.orders);
    expect(next.total).toBe(10);
    expect(next.totalToday).toBe(5);
  });
});
