import { TaskInfoState } from "./taskInfoTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TaskInfoState = {};

export const taskInfoSlice = createSlice({
  name: "taskInfo",
  initialState,
  reducers: {},
});

// export const {} = taskInfoSlice.actions;
export const taskInfoReducer = taskInfoSlice.reducer;
