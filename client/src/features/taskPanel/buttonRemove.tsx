import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC } from "react";
import { useAppDispatch } from "../../app/hooks";
import { removeProject, removeTask } from "./taskPanelSlice";
import { MenuItem } from "./taskPanelTypes";
import { Popconfirm } from "antd";
import { deleteItemMutationFn } from "../../api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// add task or subtask
interface ButtonRemoveProps {
  level: MenuItem["level"];
  itemKey: MenuItem["key"];
}

export const ButtonRemove: FC<ButtonRemoveProps> = (props) => {
  const { level, itemKey } = props;
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const deleteItemMutation = useMutation({
    mutationFn: deleteItemMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });
  const label = `remove ${level}`;

  const clickHandler = (e: any) => {
    e.stopPropagation();
    deleteItemMutation.mutate({
      level: level,
      key: itemKey,
    });
  };

  return (
    <Popconfirm
      title={`Remove ${level}`}
      description={`Are you sure you want to remove this ${level}?`}
      onConfirm={clickHandler}
      onCancel={(e) => e && e.stopPropagation()}
      okText="Yes"
      cancelText="No"
    >
      <Button
        type="text"
        danger
        size="small"
        onClick={(e) => e.stopPropagation()}
        title={label}
      >
        <DeleteOutlined label={label} />
      </Button>
    </Popconfirm>
  );
};
