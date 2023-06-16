import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router-dom";
import themeConfig from "./Ant Design Theme.json";
import "./App.sass";
import { Auth } from "./features/auth/auth";
import { AuthInterceptor } from "./features/auth/authInterceptor";
import { Home } from "./features/home/home";
import { Dashboard } from "./features/home/dashboard";

export const App = () => {
  return (
    <div className={"app-container"}>
      <ConfigProvider theme={themeConfig}>
        <AuthInterceptor />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </ConfigProvider>
    </div>
  );
};
