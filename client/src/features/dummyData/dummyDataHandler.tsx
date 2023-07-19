import { useAppDispatch } from "../../app/hooks";
import { useEffect } from "react";
import { setMenuItems } from "../taskPanel/taskPanelSlice";
import { menuItemsData } from "./menuItems";
export const DummyDataHandler: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setMenuItems(menuItemsData));
  }, [dispatch]);

  return <></>;
};
