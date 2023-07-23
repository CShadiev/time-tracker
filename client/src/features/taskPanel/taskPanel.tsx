import { FC } from "react";
import { Button, Card, Menu } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PlusOutlined } from "@ant-design/icons";
import { mapTree } from "../utils";
import { MenuItemRenderer } from "./menuItemRenderer";
import { PanelMenuItem } from "./taskPanelTypes";
import { selectItem, setOpenKeys } from "./taskPanelSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectsQuery } from "../../api/tasks";
import axios from "axios";
import { apiBase } from "../../app/config";

export const TaskPanel: FC = () => {
  const queryClient = useQueryClient();
  const { data: items } = useQuery(["projects"], getProjectsQuery);
  const openKeys = useAppSelector((s) => s.taskPanel.openKeys);
  const addProjectMutation = useMutation<unknown>(
    ["addProject"],
    async () => {
      const resp = await axios.post(apiBase + "/projects/", {
        label: "New project",
        description: "",
      });
      return resp;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"]);
      },
    }
  );
  const mapFunc = (item: PanelMenuItem) =>
    mapTree(item, (j: PanelMenuItem) => ({
      key: j.key,
      level: j.level,
      children: j.level !== "subtask" ? j.children : undefined,
      label: <MenuItemRenderer item={j} />,
    }));
  const dispatch = useAppDispatch();
  const itemsWithComponents = items?.map(mapFunc) || [];

  const addProjectHandler: React.MouseEventHandler = () => {
    addProjectMutation.mutate();
  };

  return (
    <div className="task-panel">
      <Card title="Tasks">
        <div className="button-panel">
          <Button
            shape="default"
            style={{ width: "100%" }}
            onClick={addProjectHandler}
          >
            <PlusOutlined /> new project
          </Button>
        </div>
        <Menu
          openKeys={openKeys}
          onOpenChange={(keys) => dispatch(setOpenKeys(keys))}
          onSelect={(info) =>
            info.keyPath.length > 1 &&
            dispatch(selectItem(info.key, info.keyPath))
          }
          items={itemsWithComponents}
          style={{ width: "100%" }}
          mode={"inline"}
        />
      </Card>
    </div>
  );
};
