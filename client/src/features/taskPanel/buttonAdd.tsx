import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC } from "react";
import { useAppDispatch } from "../../app/hooks";
import { MenuItem } from "./taskPanelTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiBase } from "../../app/config";

// add task or subtask
interface ButtonAddProps {
  level: MenuItem["level"];
  projectKey: string;
  parentKey: string;
}

export const ButtonAdd: FC<ButtonAddProps> = (props) => {
  const { level, parentKey, projectKey } = props;
  const queryClient = useQueryClient();
  const addTaskMutation = useMutation({
    mutationFn: async () => {
      const resp = await axios.post(
        apiBase + `/tasks/?project_key=${projectKey}`,
        {
          label: level === "project" ? "New task" : "New subtask",
          parent_id: level === "project" ? undefined : parentKey,
        }
      );
      return resp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

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
    addTaskMutation.mutate();
  };

  return (
    <Button type="text" size="small" title={label} onClick={clickHandler}>
      <PlusOutlined label={label} />
    </Button>
  );
};
