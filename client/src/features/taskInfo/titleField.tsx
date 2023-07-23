import { useAppDispatch } from "../../app/hooks";
import { FC, useState, useEffect, useRef, useCallback } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { labelValidator } from "../taskPanel/labelValidator";
import { Subtask, Task } from "../taskPanel/taskPanelTypes";
import { modifyItemMutationFn } from "../../api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  task: Task | Subtask;
};

export const TitleField: FC<Props> = (props) => {
  const { task } = props;
  const inputRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [inEdit, setInEdit] = useState(false);
  const [tempValue, setTempValue] = useState(task?.label);
  const queryClient = useQueryClient();
  const modifyLabel = useMutation({
    mutationFn: modifyItemMutationFn,
    onSuccess: () => {
      // invalidate projects and tasks
      queryClient.invalidateQueries(["tasks"]);
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const dispatch = useAppDispatch();

  const saveNewLabel = useCallback(() => {
    if (task && task.label !== tempValue && (tempValue || tempValue === "")) {
      const validatedVal = labelValidator(tempValue);
      if (validatedVal) {
        modifyLabel.mutate({
          level: task.level,
          key: task.key,
          label: validatedVal,
        });
        setTempValue(validatedVal);
      } else {
        setTempValue(task.label);
      }
    }
  }, [dispatch, tempValue, task]);

  const blurHandler = (e: React.FocusEvent) => {
    if (inEdit) {
      // reset to original value
      setTempValue(task?.label);
      setInEdit(false);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempValue(value);
  };

  // save on 'enter'
  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (inEdit) {
        // save only if valid
        if (labelValidator(tempValue)) {
          saveNewLabel();
          setInEdit(false);
        }
      }
    } else {
      if (e.key === "Escape") {
        // reset to original value
        setTempValue(task?.label);
        setInEdit(false);
      }
    }
  };

  // sync global state --> tempValue
  useEffect(() => {
    setTempValue(task?.label);
  }, [task?.label]);

  // auto focus on edit
  useEffect(() => {
    if (inEdit) {
      inputRef.current?.focus();
    }
  }, [inEdit]);

  return (
    <div
      className="editable-field"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!inEdit && <div className="task-title">{task?.label}</div>}
      {inEdit && (
        <Input
          ref={inputRef}
          value={tempValue}
          onKeyDown={keyDownHandler}
          onBlur={blurHandler}
          onChange={changeHandler}
          status={labelValidator(tempValue) ? "" : "error"}
        />
      )}
      {isHovered && !inEdit && (
        <div className="editable-field-control">
          <Button
            title="Rename task"
            size="small"
            type="text"
            onClick={() => setInEdit(true)}
          >
            <EditOutlined />
          </Button>
        </div>
      )}
    </div>
  );
};
