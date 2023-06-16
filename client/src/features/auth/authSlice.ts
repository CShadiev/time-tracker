import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User, authState } from "./authTypes";

const initialState: authState = {
  access_token: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
    unsetAccessToken: (state) => {
      state.access_token = null;
    },
  },
});

export const { setUser, setAccessToken, unsetAccessToken } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
