import { CountDownState } from "./countDownTimerTypes";
import { AppThunk } from "../../app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getWorker from "./workerInstance";
import { saveSessionMutationFn } from "../../api/sessions";
import { queryClient } from "../../queryClient";

const worker = getWorker();

const initialState: CountDownState = {
  /* initialize with default timer
    later may be used with user settings */

  isDisabled: true,
  initialCount: 40 * 60, // initial count down value
  expectedTime: null,
  count: 40 * 60,
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
      console.log("stopping timer");
      worker.postMessage({
        action: "STOP_TIMER",
      });
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
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
    _setInitialCount: (state, action: PayloadAction<number>) => {
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
  resetCountDown,
  setCount,
  enableCountDown,
  disableCountDown,
} = countDownSlice.actions;
export const countDownReducer = countDownSlice.reducer;

export const setInitialCount = (count: number): AppThunk => {
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

    if (state.countDown.initialCount > state.countDown.count) {
      if (state.taskPanel.selectedItem) {
        saveSessionMutationFn({
          initialCount: state.countDown.initialCount - state.countDown.count,
          taskId: state.taskPanel.selectedItem,
        });
        queryClient.refetchQueries(["sessions"]);
      }
      dispatch(resetCountDown());
    }
  };
};

export const finishCountDown = (): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(resetCountDown());
    if (state.countDown.autoContinue) {
      worker.postMessage({
        action: "START_TIMER",
        initialCount: state.countDown.initialCount,
      });
    }
  };
};
