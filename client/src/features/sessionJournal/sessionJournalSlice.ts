import {
  SessionJournalItem,
  SessionJournalState,
} from "./sessionJournalTypes";
import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { AppThunk } from "../../app/store";

const initialState: SessionJournalState = {
  items: [],
};

const sessionJournalSlice = createSlice({
  name: "sessionJournal",
  initialState,
  reducers: {
    _addSessionEntry: (
      state,
      action: PayloadAction<SessionJournalItem>
    ) => {
      state.items.push(action.payload);
    },
  },
});

export const { _addSessionEntry } =
  sessionJournalSlice.actions;

/**
 * store current session in the journal
 * @returns void
 */
export const addSessionEntry = (): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.taskPanel.selectedItem) {
      console.error("No task selected");
      return;
    }

    const sessionEntry: SessionJournalItem = {
      id: uuidv4(),
      finished_at: new Date().toISOString(),
      time:
        state.countDown.initialCount -
        state.countDown.count,
      expected_time: state.countDown.expectedTime,
      task_id: state.taskPanel.selectedItem,
    };
    dispatch(_addSessionEntry(sessionEntry));
  };
};

export const sessionJournalReducer =
  sessionJournalSlice.reducer;
