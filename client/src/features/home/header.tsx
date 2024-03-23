import { Button } from "antd";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setAboutDrawerOpen } from "../taskPanel/taskPanelSlice";
import { accessTokenSelector, unsetAccessToken } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";

export const Header: FC = () => {
  const access_token = useAppSelector(accessTokenSelector);
  const isAboutDrawerOpen = useAppSelector((s) => s.taskPanel.aboutDrawerOpen);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logOut = () => {
    localStorage.removeItem("access_token");
    dispatch(unsetAccessToken());
    navigate("/auth");
  };

  console.log(access_token);

  return (
    <div className="app-header">
      <div style={{ whiteSpace: "nowrap" }}>Time Tracker</div>
      <Button
        type="link"
        size="large"
        onClick={() => {
          dispatch(setAboutDrawerOpen(!isAboutDrawerOpen));
        }}
      >
        About
      </Button>
      <div className="spacer" />
      {!!access_token && (
        <Button type="link" size="large" onClick={logOut}>
          Log out
        </Button>
      )}
    </div>
  );
};
