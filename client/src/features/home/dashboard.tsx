import { CountDownTimer } from "../countDownTimer/countDownTimer";
import { Settings } from "../countDownTimer/settings";
import { SwitchNotification } from "../countDownTimer/switchNotification";
import { SessionJournal } from "../sessionJournal/sessionJournal";
import { TaskInfo } from "../taskInfo/taskInfo";
import { TaskPanel } from "../taskPanel/taskPanel";

export const Dashboard: React.FC = () => {
  return (
    <>
      {/* <DummyDataHandler /> */}
      <SwitchNotification />
      <TaskPanel />
      <div style={{ display: "flex", marginLeft: "1em" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "22em",
          }}
        >
          <CountDownTimer />
          <div style={{ height: "1em" }} />
          <TaskInfo />
        </div>
      </div>
      <div className="timer-settings-container" style={{ marginLeft: "1em" }}>
        <Settings />
        <SessionJournal />
      </div>
    </>
  );
};
