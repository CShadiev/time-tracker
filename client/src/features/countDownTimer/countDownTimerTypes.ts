export interface CountDownState {
  isDisabled: boolean;
  // expected time to complete the task in seconds
  expectedTime: number | null;
  // initial count down value
  initialCount: number;
  // current count down value
  count: number;

  // whether to show notification on switching tasks
  // prevents repeated notifications
  showSwitchNotification: boolean;

  // whether the notification on switching tasks
  // is shown now
  switchNotificationIsShown: boolean;

  // start next session automatically
  autoContinue: boolean;
}

export type WorkerIncomingMessage =
  | WorkerStartTimerMessage
  | WorkerStopTimerMessage;

export type WorkerOutgoingMessage =
  | WorkerCountDownMessage
  | WorkerPlayNotificationMessage
  | WorkerFinishTimerMessage;

export interface WorkerStartTimerMessage {
  action: "START_TIMER";
  initialCount: number;
}

export interface WorkerStopTimerMessage {
  action: "STOP_TIMER";
}

export interface WorkerCountDownMessage {
  action: "DECREASE_COUNT";
  currentCount: number;
}

export interface WorkerPlayNotificationMessage {
  action: "PLAY_NOTIFICATION";
}

export interface WorkerFinishTimerMessage {
  action: "FINISH_TIMER";
}
