import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  email: string;
  name: string;
  isAuth: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  email: '',
  name: '',
  isAuth: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ email: string; name: string }>) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.isAuth = true;
      state.error = null;
    },
    clearUser(state) {
      state.email = '';
      state.name = '';
      state.isAuth = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
