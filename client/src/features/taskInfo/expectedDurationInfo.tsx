import { Input, InputNumber } from "antd";
import { FC, useRef, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectCurrentItem, updateItem } from "../taskPanel/taskPanelSlice";
import { _setExpectedDurationIsInEdit } from "./taskInfoSlice";
import { Subtask, Task } from "../taskPanel/taskPanelTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyItemMutationFn } from "../../api/tasks";

type Props = {
  task: Task | Subtask;
};

export const ExpectedDurationInfo: FC<Props> = (props) => {
  const { task } = props;
  const inputRef = useRef<any>(null);
  const inEdit = useAppSelector((s) => s.taskInfo.expectedDurationIsInEdit);
  const [tempValue, setTempValue] = useState(task?.expected_time);
  const queryClient = useQueryClient();

  const setTimeMutation = useMutation({
    mutationFn: modifyItemMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", task?.key]);
    },
  });
  const dispatch = useAppDispatch();

  const setInEdit = (val: boolean) =>
    dispatch(_setExpectedDurationIsInEdit(val));
  const saveValue = (value: number | null | undefined) => {
    if (!task) {
      return;
    }

    if (value === null || value === undefined) {
      return;
    }
    setTimeMutation.mutate({
      key: task.key,
      level: task.level,
      expected_time: value * 60,
    });
  };

  const blurHandler = (e: React.FocusEvent) => {
    if (inEdit) {
      // reset value
      setTempValue(task?.expected_time && Math.floor(task.expected_time / 60));
      setInEdit(false);
    }
  };

  // save on 'enter'
  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (inEdit) {
        saveValue(tempValue);
        setInEdit(false);
      }
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(parseInt(e.target.value));
  };

  // sync global state --> tempValue
  useEffect(() => {
    setTempValue(task?.expected_time && Math.floor(task.expected_time / 60));
  }, [task?.expected_time]);

  // auto focus on edit
  useEffect(() => {
    if (inEdit) {
      inputRef.current?.focus();
    }
  }, [inEdit]);
  
  return (
    <div
      className="info-group expected-time"
      onClick={() => !inEdit && setInEdit(true)}
    >
      <div className="label">expected time (minutes)</div>
      {!inEdit && (
        <div
          className="value"
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {(task?.expected_time && Math.floor(task.expected_time / 60)) ||
            "N/A"}
        </div>
      )}
      {inEdit && (
        <Input
          type={"number"}
          ref={inputRef}
          value={tempValue || undefined}
          placeholder={"N/A"}
          onKeyDown={keyDownHandler}
          onBlur={blurHandler}
          onChange={changeHandler}
        />
      )}
    </div>
  );
};
