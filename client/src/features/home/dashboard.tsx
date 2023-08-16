import { CountDownTimer } from "../countDownTimer/countDownTimer";
import { PerformanceChart } from "../countDownTimer/performanceChart";
import { Settings } from "../countDownTimer/settings";
import { SessionJournal } from "../sessionJournal/sessionJournal";
import { TaskInfo } from "../taskInfo/taskInfo";
import { TaskPanel } from "../taskPanel/taskPanel";

export const Dashboard: React.FC = () => {
  return (
    <>
      <TaskPanel />
      <div style={{ display: "flex", marginLeft: "1em" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "24rem",
          }}
        >
          <CountDownTimer />
          <div style={{ height: "1em" }} />
          <TaskInfo />
        </div>
      </div>
      <div
        className="timer-settings-container"
        style={{
          marginLeft: "1em",
          gap: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Settings />
        <PerformanceChart />
        <SessionJournal />
      </div>
    </>
  );
};
