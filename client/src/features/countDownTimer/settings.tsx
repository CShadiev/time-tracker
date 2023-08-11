import { Card, Input, Switch } from "antd";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_SESSION_DURATION } from "../../app/config";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  disableAutoContinue,
  enableAutoContinue,
  resetCountDown,
  safeResetCountDown,
  setInitialCount,
} from "./countDownSlice";
import { useEffect, useState } from "react";
import { SwitchNotification } from "./switchNotification";

export const Settings = () => {
  // persist settings to local storage
  const [duration, setDuration] = useLocalStorage<number>(
    "settings-duration",
    DEFAULT_SESSION_DURATION
  );
  const [autoContinue, setAutoContinue] = useLocalStorage<boolean>(
    "settings-auto-continue",
    false
  );
  const countDown = useAppSelector((s) => s.countDown.count);
  const [showSwitchNotification, setShowSwitchNotification] =
    useState<boolean>(false);
  // this function will be passed to the switch notification
  let actionFn = () => {};
  const dispatch = useAppDispatch();

  const durationChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && parseInt(e.target.value) > 0) {
      if (countDown !== duration) {
        actionFn = () => setDuration(parseInt(e.target.value) * 60);
        setShowSwitchNotification(true);
      } else {
        setDuration(parseInt(e.target.value) * 60);
      }
    }
  };

  // sync settings with redux store
  useEffect(() => {
    dispatch(setInitialCount(duration));
  }, [duration, dispatch]);
  useEffect(() => {
    autoContinue
      ? dispatch(enableAutoContinue())
      : dispatch(disableAutoContinue());
  }, [autoContinue, dispatch]);

  return (
    <>
      <SwitchNotification
        open={showSwitchNotification}
        onCancel={() => setShowSwitchNotification(false)}
        onSuccess={() => {
          setShowSwitchNotification(false);
          dispatch(safeResetCountDown());
          actionFn();
        }}
        onSecondOption={() => {
          setShowSwitchNotification(false);
          dispatch(resetCountDown());
          actionFn();
        }}
      />
      <Card title="Settings">
        <div className="settings-item">
          <div>Session duration (minutes)</div>
          <Input
            type="number"
            value={Math.floor(duration / 60)}
            onChange={durationChangeHandler}
          />
        </div>
        <div className="settings-item">
          <div>Auto start new session</div>
          <Switch
            checked={autoContinue}
            onChange={(checked) => setAutoContinue(checked)}
          />
        </div>
      </Card>
    </>
  );
};
