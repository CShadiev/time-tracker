import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router-dom";
import themeConfig from "./Ant Design Theme.json";
import "./App.sass";
import { Auth } from "./features/auth/auth";
import { Home } from "./features/home/home";
import { Dashboard } from "./features/home/dashboard";
import { ToastContainer } from "react-toastify";
import { AuthInterceptor } from "./features/auth/authInterceptor";
import { Header } from "./features/home/header";
import { AboutDrawer } from "./features/home/about";

export const App = () => {
  return (
    <>
      <Header />
      <AboutDrawer />
      <div className={"app-container"}>
        <ConfigProvider theme={themeConfig}>
          <ToastContainer />
          <AuthInterceptor />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </ConfigProvider>
      </div>
    </>
  );
};
