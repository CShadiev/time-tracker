import {
  configureStore,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { taskPanelReducer } from "../features/taskPanel/taskPanelSlice";
import { countDownReducer } from "../features/countDownTimer/countDownSlice";
import { sessionJournalReducer } from "../features/sessionJournal/sessionJournalSlice";
import { taskInfoReducer } from "../features/taskInfo/taskInfoSlice";
import { authSliceReducer } from "../features/auth/autSlice";

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    taskPanel: taskPanelReducer,
    countDown: countDownReducer,
    sessionJournal: sessionJournalReducer,
    taskInfo: taskInfoReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
