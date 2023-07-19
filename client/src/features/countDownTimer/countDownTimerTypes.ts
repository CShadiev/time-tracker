export interface CountDownState {
  isOnPause: boolean;

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
