import { SessionJournalItem, SessionJournalState } from "./sessionJournalTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { AppThunk } from "../../app/store";

const initialState: SessionJournalState = {
  items: [],
};

const sessionJournalSlice = createSlice({
  name: "sessionJournal",
  initialState,
  reducers: {
    _addSessionEntry: (state, action: PayloadAction<SessionJournalItem>) => {
      state.items.push(action.payload);
    },
  },
});

export const { _addSessionEntry } = sessionJournalSlice.actions;

/**
 * store current session in the journal
 * @returns void
 */

export const sessionJournalReducer = sessionJournalSlice.reducer;
