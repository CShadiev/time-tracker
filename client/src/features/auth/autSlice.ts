import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User, authState } from "./authTypes";

const initialState: authState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  }
});


export const { setUser } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;