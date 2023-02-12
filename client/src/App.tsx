import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router-dom";
import themeConfig from "./Ant Design Theme.json";
import "./App.sass";
import { CountDownTimer } from "./features/countDownTimer/countDownTimer";
import { TaskPanel } from "./features/taskPanel/taskPanel";
import { SwitchNotification } from "./features/countDownTimer/switchNotification";
import { Settings } from "./features/countDownTimer/settings";
import { TaskInfo } from "./features/taskInfo/taskInfo";

const MainPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row",
        padding: "1em 2em",
        alignItems: "flex-start",
      }}
    >
      <SwitchNotification />
      <TaskPanel />
      <div style={{ display: "flex", marginLeft: "1em" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CountDownTimer />
          <div style={{ height: "1em" }} />
          <TaskInfo />
        </div>
      </div>
      <div
        className="timer-settings-container"
        style={{ marginLeft: "1em" }}
      >
        <Settings />
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <div className={"app-container"}>
      <ConfigProvider theme={themeConfig}>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </ConfigProvider>
    </div>
  );
};
