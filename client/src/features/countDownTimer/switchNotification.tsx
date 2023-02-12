import { Button, Modal } from "antd";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import {
  hideSwitchNotification,
  hideSwitchNotificationAndDontShowAgain,
} from "./countDownSlice";

/**
 * Show a modal on task switch to make sure
 * the user does not lose current session by mistake
 */
export const SwitchNotification = () => {
  const open = useAppSelector(
    (s) => s.countDown.switchNotificationIsShown
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      title="Your session is saved"
      open={open}
      onCancel={() => dispatch(hideSwitchNotification())}
      footer={[
        <Button
          key={"switch-notification-dont-show-again"}
          onClick={() =>
            dispatch(
              hideSwitchNotificationAndDontShowAgain()
            )
          }
        >
          Don't show this message again
        </Button>,
        <Button
          key={"switch-notification-ok"}
          type="primary"
          onClick={() => dispatch(hideSwitchNotification())}
        >
          OK
        </Button>,
      ]}
    >
      <p>
        Every time you switch to another task before the
        countdown timer ends or when you change some of the
        settings, time spent on the previous task is saved
        and the countdown is reset.
      </p>
    </Modal>
  );
};
