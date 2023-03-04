import { TaskInfoState } from "./taskInfoTypes";
import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const initialState: TaskInfoState = {
  expectedDurationIsInEdit: false,
};

export const taskInfoSlice = createSlice({
  name: "taskInfo",
  initialState,
  reducers: {
    _setExpectedDurationIsInEdit: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.expectedDurationIsInEdit = action.payload;
    },
  },
});

export const { _setExpectedDurationIsInEdit } =
  taskInfoSlice.actions;
export const taskInfoReducer = taskInfoSlice.reducer;
