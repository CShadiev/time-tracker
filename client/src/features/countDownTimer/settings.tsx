import { Card, Input, Switch } from "antd";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import {
  disableAutoContinue,
  enableAutoContinue,
  setInitialCount,
} from "./countDownSlice";

export const Settings = () => {
  const duration = useAppSelector(
    (s) => s.countDown.initialCount
  );
  const autoContinue = useAppSelector(
    (s) => s.countDown.autoContinue
  );
  const dispatch = useAppDispatch();

  return (
    <Card title="Settings">
      <div className="settings-item">
        <div>Session duration (minutes)</div>
        <Input
          type="number"
          value={Math.floor(duration / 60)}
          onChange={(e) =>
            dispatch(
              setInitialCount(parseInt(e.target.value) * 60)
            )
          }
        />
      </div>
      <div className="settings-item">
        <div>Auto start new session</div>
        <Switch
          checked={autoContinue}
          onChange={(checked) =>
            checked
              ? dispatch(enableAutoContinue())
              : dispatch(disableAutoContinue())
          }
        />
      </div>
    </Card>
  );
};
