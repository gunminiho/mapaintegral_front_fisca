import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  user: true,
  loading: false,

}

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    moduleLoading: (state, action) => {
      state.moduleLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    setIdIncidencias: (state, action) => {
      state.idIncidencias = action.payload;
    },
  }
});

export const { logout, moduleLoading, setIdIncidencias } = AuthSlice.actions

export default AuthSlice.reducer