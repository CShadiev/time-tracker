import { Button, Modal } from "antd";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { hideSwitchNotification } from "./countDownSlice";
import { FC } from "react";

/**
 * Show a modal on task switch to make sure
 * the user does not lose current session by mistake
 */

type SwitchNotificationProps = {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
};

export const SwitchNotification: FC<SwitchNotificationProps> = (props) => {
  const { onSuccess, onCancel, open } = props;
  const dispatch = useAppDispatch();

  return (
    <Modal
      title="Session is in progress"
      open={open}
      onCancel={() => dispatch(hideSwitchNotification())}
      footer={[
        <Button key={"switch-notification-dont-show-again"} onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key={"switch-notification-ok"}
          type="primary"
          onClick={onSuccess}
        >
          Save current session and continue
        </Button>,
      ]}
    >
      <p>
        You have a session that is still in progress. If you continue with this
        action, this session will be saved and the timer will be reset.
      </p>
      <p>
        Alternatively, you can cancel this action, finish the current session
        and then try again.
      </p>
    </Modal>
  );
};
