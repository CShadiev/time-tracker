import { useCountDown } from "./countDownHook";
import { formatDuration } from "../utils";
import { Card } from "antd";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  pauseTimer,
  resetCountDown,
  resumeTimer,
} from "./countDownSlice";
import { useSpring, animated } from "@react-spring/web";

export const CountDownTimer = () => {
  const countDown = useCountDown();
  const isDisabled = useAppSelector(
    (s) => s.countDown.isDisabled
  );
  const springMotion = {
    to: [
      { x: 4 },
      { x: -4 },
      { x: 0 },
      { x: 4 },
      { x: -4 },
      { x: 0 },
    ],
    config: { duration: 50 },
  };
  const [springs, springAPI] = useSpring(() => ({
    from: { x: 0 },
  }));

  const dispatch = useAppDispatch();

  return (
    <div className="countdown-timer">
      <Card
        title="Countdown Timer"
        actions={[
          <div
            className="danger"
            onClick={() =>
              !isDisabled && dispatch(resetCountDown())
            }
          >
            reset
          </div>,
          <div
            onClick={() =>
              !isDisabled && dispatch(pauseTimer())
            }
          >
            pause
          </div>,
          <div
            onClick={() => {
              if (!isDisabled) {
                dispatch(resumeTimer());
              } else {
                springAPI.start(springMotion);
              }
            }}
            // onClick={() =>

            // }
          >
            start
          </div>,
        ]}
      >
        <div className="countdown-timer-label">
          {formatDuration(countDown)}
        </div>
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
