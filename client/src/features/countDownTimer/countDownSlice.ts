import { CountDownState } from "./countDownTimerTypes";
import { AppThunk } from "../../app/store";
import { addSessionEntry } from "../sessionJournal/sessionJournalSlice";
import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const initialState: CountDownState = {
  /* initialize with default timer
    later may be used with user settings */

  isDisabled: true,
  initialCount: 5, // initial count down value
  isOnPause: true, // control to pause the count down
  expectedTime: null,
  count: 5,
  showSwitchNotification: true,
  switchNotificationIsShown: false,
  autoContinue: false,
};

export const countDownSlice = createSlice({
  name: "countDown",
  initialState,
  reducers: {
    resetCountDown: (state) => {
      state.count = state.initialCount;
      state.isOnPause = true;
    },
    pauseTimer: (state) => {
      state.isOnPause = true;
    },
    resumeTimer: (state) => {
      state.isOnPause = false;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    decreaseCount: (state) => {
      if (state.count > 0) {
        state.count = state.count - 1;
      }
      if (state.count === 0) {
        state.isOnPause = true;
      }
    },
    enableCountDown: (state) => {
      state.isDisabled = false;
    },
    disableCountDown: (state) => {
      state.isDisabled = true;
    },
    showSwitchNotification: (state) => {
      if (state.showSwitchNotification) {
        state.switchNotificationIsShown = true;
      }
    },
    hideSwitchNotification: (state) => {
      state.switchNotificationIsShown = false;
    },
    hideSwitchNotificationAndDontShowAgain: (state) => {
      state.showSwitchNotification = false;
      state.switchNotificationIsShown = false;
    },
    _setInitialCount: (
      state,
      action: PayloadAction<number>
    ) => {
      if (Number(action.payload)) {
        state.initialCount = action.payload;
        state.count = action.payload;
      }
    },
    enableAutoContinue: (state) => {
      state.autoContinue = true;
    },
    disableAutoContinue: (state) => {
      state.autoContinue = false;
    },
  },
});

export const {
  enableAutoContinue,
  disableAutoContinue,
  _setInitialCount,
  showSwitchNotification,
  hideSwitchNotification,
  hideSwitchNotificationAndDontShowAgain,
  decreaseCount,
  resetCountDown,
  pauseTimer,
  resumeTimer,
  setCount,
  enableCountDown,
  disableCountDown,
} = countDownSlice.actions;
export const countDownReducer = countDownSlice.reducer;

export const setInitialCount = (
  count: number
): AppThunk => {
  return (dispatch) => {
    dispatch(safeResetCountDown());
    dispatch(_setInitialCount(count));
  };
};

/**
 * makes sure that countdown is only enabled when
 * a task is selected. should be called once on init
 * and on task select.
 * @returns void
 */
export const validateCountDown = (): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();

    if (state.taskPanel.selectedItem) {
      dispatch(enableCountDown());
    }

    if (!state.taskPanel.selectedItem) {
      dispatch(disableCountDown());
    }
  };
};

/**
 * checks if any time passed during current session.
 * if so, saves the session and resets the countdown.
 * @returns void
 */
export const safeResetCountDown = (): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();

    if (
      state.countDown.initialCount > state.countDown.count
    ) {
      dispatch(addSessionEntry());
      dispatch(resetCountDown());
      dispatch(showSwitchNotification());
    }
  };
};

export const finishCountDown = (): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(addSessionEntry());
    dispatch(resetCountDown());
    if (state.countDown.autoContinue) {
      dispatch(resumeTimer());
    }
  };
};
