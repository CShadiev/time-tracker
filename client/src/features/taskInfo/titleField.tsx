import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import {
  renameItem,
  selectCurrentItem,
} from "../taskPanel/taskPanelSlice";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { labelValidator } from "../taskPanel/labelValidator";

export const TitleField = () => {
  const task = useAppSelector(selectCurrentItem);
  const inputRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [inEdit, setInEdit] = useState(false);
  const [tempValue, setTempValue] = useState(task?.label);

  const dispatch = useAppDispatch();

  const saveNewLabel = useCallback(() => {
    if (
      task &&
      task.label !== tempValue &&
      (tempValue || tempValue === "")
    ) {
      if (labelValidator(tempValue)) {
        dispatch(
          renameItem({
            key: task.key,
            label: tempValue,
          })
        );
      } else {
        setTempValue(task.label);
      }
    }
  }, [dispatch, tempValue, task]);

  const blurHandler = (e: React.FocusEvent) => {
    if (inEdit) {
      saveNewLabel();
      setInEdit(false);
    }
  };

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      {!inEdit && (
        <div className="task-title">{task?.label}</div>
      )}
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
