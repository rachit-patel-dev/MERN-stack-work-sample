import { createSlice } from '@reduxjs/toolkit';

import { IToken, IUserData } from '../../types';

interface IAuthState {
  isUserLoggedin: boolean;
  userData: IUserData | null;
  token: IToken | null;
}

const initialState: IAuthState = {
  isUserLoggedin: false,
  userData: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isUserLoggedin = true;
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isUserLoggedin = false;
      state.userData = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', JSON.stringify(action.payload));
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
