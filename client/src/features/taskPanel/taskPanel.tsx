import { FC } from "react";
import { Button, Menu } from "antd";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import { PlusOutlined } from "@ant-design/icons";
import { mapTree } from "../utils";
import { MenuItemRenderer } from "./menuItemRenderer";
import { MenuItem } from "./taskPanelTypes";
import {
  addProject,
  selectItem,
  setOpenKeys,
} from "./taskPanelSlice";

export const TaskPanel: FC = () => {
  const items = useAppSelector(
    (s) => s.taskPanel.menuItems
  );
  const openKeys = useAppSelector(
    (s) => s.taskPanel.openKeys
  );
  const mapFunc = (item: MenuItem) =>
    mapTree(item, (j: MenuItem) => ({
      key: j.key,
      level: j.level,
      children: j.children,
      label: <MenuItemRenderer item={j} />,
    }));
  const dispatch = useAppDispatch();
  const itemsWithComponents = items.map(mapFunc);

  const clickHandler: React.MouseEventHandler = () => {
    dispatch(addProject());
  };

  return (
    <div className="task-panel">
      <div className="button-panel">
        <Button
          shape="default"
          style={{ width: "100%" }}
          onClick={clickHandler}
        >
          <PlusOutlined /> new project
        </Button>
      </div>
      <Menu
        openKeys={openKeys}
        onOpenChange={(keys) => dispatch(setOpenKeys(keys))}
        onSelect={(item) => dispatch(selectItem(item.key))}
        items={itemsWithComponents}
        style={{ width: "100%" }}
        mode={"inline"}
      />
    </div>
  );
};
