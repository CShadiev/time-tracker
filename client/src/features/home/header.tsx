import { Button } from "antd";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setAboutDrawerOpen } from "../taskPanel/taskPanelSlice";

export const Header: FC = () => {
  const isAboutDrawerOpen = useAppSelector((s) => s.taskPanel.aboutDrawerOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="app-header">
      <div>Time Tracker</div>
      <Button
        type="link"
        size="large"
        onClick={() => {
          dispatch(setAboutDrawerOpen(!isAboutDrawerOpen));
        }}
      >
        About
      </Button>
    </div>
  );
};
