import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addTask } from "./taskPanelSlice";
import { MenuItem } from "./taskPanelTypes";

// add task or subtask
interface ButtonAddProps {
  level: MenuItem["level"];
  itemKey: MenuItem["key"];
}

export const ButtonAdd: FC<ButtonAddProps> = (props) => {
  const { level, itemKey } = props;
  const dispatch = useAppDispatch();
  let label = "add";

  if (level === "project") {
    label += " task";
  }
  if (level === "task") {
    label += " subtask";
  }

  const clickHandler: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    dispatch(addTask(itemKey));
  };

  return (
    <Button
      type="text"
      size="small"
      title={label}
      onClick={clickHandler}
    >
      <PlusOutlined label={label} />
    </Button>
  );
};
