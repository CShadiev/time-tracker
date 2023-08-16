import { useCountDown } from "./countDownHook";
import { formatDuration } from "../utils";
import { Card } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetCountDown, safeResetCountDown } from "./countDownSlice";
import { useSpring, animated } from "@react-spring/web";
import { SwitchNotification } from "./switchNotification";
import { useEffect, useState } from "react";

export const CountDownTimer = () => {
  const { count: countDown, startCountDown, stopCountDown } = useCountDown();
  const initialCount = useAppSelector((s) => s.countDown.initialCount);
  const isDisabled = useAppSelector((s) => s.countDown.isDisabled);
  const springMotion = {
    to: [{ x: 4 }, { x: -4 }, { x: 0 }, { x: 4 }, { x: -4 }, { x: 0 }],
    config: { duration: 50 },
  };
  const [springs, springAPI] = useSpring(() => ({
    from: { x: 0 },
  }));
  const [showResetDialog, setShowResetDialog] = useState(false);
  const showResetDialogWrapper = () => {
    if (countDown < initialCount) {
      setShowResetDialog(true);
    }
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="countdown-timer">
      <SwitchNotification
        open={showResetDialog}
        onSuccess={() => {
          setShowResetDialog(false);
          dispatch(safeResetCountDown());
        }}
        onSecondOption={() => {
          dispatch(resetCountDown());
          setShowResetDialog(false);
        }}
        onCancel={() => setShowResetDialog(false)}
      />

      <Card
        title="Countdown Timer"
        actions={[
          <div
            className="danger"
            onClick={() => !isDisabled && showResetDialogWrapper()}
          >
            reset
          </div>,
          <div onClick={() => !isDisabled && stopCountDown()}>pause</div>,
          <div
            onClick={() => {
              if (!isDisabled) {
                startCountDown();
              } else {
                springAPI.start(springMotion);
              }
            }}
          >
            start
          </div>,
        ]}
      >
        <div className="countdown-timer-label">{formatDuration(countDown)}</div>
        <div>
          {isDisabled && (
            <animated.div
              className={"countdown-timer-comment"}
              style={{ ...springs }}
            >
              Please, select a task to start a session
            </animated.div>
          )}
        </div>
      </Card>
    </div>
  );
};
