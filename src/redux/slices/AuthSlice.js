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

  }
});

export const {} = AuthSlice.actions

export default AuthSlice.reducer