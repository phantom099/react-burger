import reducer, { setUser, clearUser, setLoading, setError } from './userSlice';

describe('userSlice reducer', () => {
  it('should return the initial state', () => {
    const initial = reducer(undefined as any, { type: '@@INIT' } as any);
    expect(initial).toEqual({ email: '', name: '', isAuth: false, loading: false, error: null });
  });

  it('should set user', () => {
    const next = reducer(undefined as any, setUser({ email: 'a@b', name: 'A' }));
    expect(next.email).toBe('a@b');
    expect(next.name).toBe('A');
    expect(next.isAuth).toBe(true);
    expect(next.error).toBeNull();
  });

  it('should clear user', () => {
    const prev = { email: 'x', name: 'X', isAuth: true, loading: false, error: 'e' };
    const next = reducer(prev as any, clearUser());
    expect(next.email).toBe('');
    expect(next.isAuth).toBe(false);
    expect(next.error).toBeNull();
  });

  it('should set loading', () => {
    const next = reducer(undefined as any, setLoading(true));
    expect(next.loading).toBe(true);
  });

  it('should set error', () => {
    const next = reducer(undefined as any, setError('err'));
    expect(next.error).toBe('err');
  });
});
