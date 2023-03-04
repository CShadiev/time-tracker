import { Input, InputNumber } from "antd";
import { FC, useRef, useState, useEffect } from "react";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import {
  selectCurrentItem,
  updateItem,
} from "../taskPanel/taskPanelSlice";
import { _setExpectedDurationIsInEdit } from "./taskInfoSlice";

export const ExpectedDurationInfo: FC = () => {
  const task = useAppSelector(selectCurrentItem);
  const inputRef = useRef<any>(null);
  const inEdit = useAppSelector(
    (s) => s.taskInfo.expectedDurationIsInEdit
  );
  const [tempValue, setTempValue] = useState(
    task?.expected_time
  );

  const dispatch = useAppDispatch();

  const setInEdit = (val: boolean) =>
    dispatch(_setExpectedDurationIsInEdit(val));
  const saveValue = (value: number | null | undefined) => {
    if (!task) {
      return;
    }

    dispatch(
      updateItem({
        key: task?.key,
        expected_time: (value && value * 60) || null,
      })
    );
  };

  const blurHandler = (e: React.FocusEvent) => {
    if (inEdit) {
      saveValue(tempValue);
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

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTempValue(parseInt(e.target.value));
  };

  // sync global state --> tempValue
  useEffect(() => {
    setTempValue(
      task?.expected_time &&
        Math.floor(task.expected_time / 60)
    );
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
        <div className="value">
          {(task?.expected_time &&
            Math.floor(task.expected_time / 60)) ||
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
