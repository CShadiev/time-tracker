/* eslint-disable no-restricted-globals */

let timerIntervalRef: any = null;
let currentCount: number = 0;

const recursiveNotification = (n: number = 1) => {
  if (n <= 3) {
    self.postMessage({ action: "PLAY_NOTIFICATION" });
    setTimeout(() => {
      recursiveNotification(n + 1);
    }, 1900);
  }
};

self.onmessage = (message: {
  data: { action: string; initialCount: number };
}) => {
  const { action, initialCount } = message.data;
  if (action === "START_TIMER") {
    currentCount = initialCount;
    if (timerIntervalRef) {
      clearInterval(timerIntervalRef);
    }
    timerIntervalRef = setInterval(() => {
      currentCount--;
      self.postMessage({
        action: "DECREASE_COUNT",
        currentCount: currentCount,
      });
      if (currentCount === 0) {
        clearInterval(timerIntervalRef);
        self.postMessage({ action: "FINISH_TIMER" });
        recursiveNotification();
      }
    }, 1000);
  }
  if (action === "STOP_TIMER") {
    if (timerIntervalRef) {
      clearInterval(timerIntervalRef);
    }
  }
};

export {};
