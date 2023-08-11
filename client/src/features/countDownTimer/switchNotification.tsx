import { Button, Modal } from "antd";
import { useAppDispatch } from "../../app/hooks";
import { hideSwitchNotification } from "./countDownSlice";
import { FC } from "react";

/**
 * Show a modal on task switch to make sure
 * the user does not lose current session by mistake
 */

type SwitchNotificationProps = {
  open: boolean;
  onSuccess: () => void;
  onSecondOption: () => void;
  onCancel: () => void;
};

export const SwitchNotification: FC<SwitchNotificationProps> = (props) => {
  const { onSuccess, onCancel, onSecondOption, open } = props;
  const dispatch = useAppDispatch();

  return (
    <Modal
      title="Session is in progress"
      open={open}
      onCancel={() => dispatch(hideSwitchNotification())}
      footer={[
        <Button key={"switch-notification-cancel"} onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          danger
          key={"switch-notification-dont-save"}
          onClick={onSecondOption}
        >
          Don't save
        </Button>,
        <Button
          key={"switch-notification-ok"}
          type="primary"
          onClick={onSuccess}
        >
          Save current session
        </Button>,
      ]}
    >
      <p>
        You have a session that is still in progress. Do you want to save it
        before continuing?
      </p>
    </Modal>
  );
};
