import { Input, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import {
  FC,
  useCallback,
  useRef,
  useState,
  useEffect,
  Fragment,
} from "react";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import {
  selectCurrentItem,
  updateItem,
} from "../taskPanel/taskPanelSlice";

export const DescriptionField: FC = () => {
  const task = useAppSelector(selectCurrentItem);
  const inputRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [inEdit, setInEdit] = useState(false);
  const [tempValue, setTempValue] = useState(
    task?.description
  );

  const dispatch = useAppDispatch();

  const saveValue = (value: string | null | undefined) => {
    if (!task) {
      return;
    }

    if (!(value || "")) {
      return;
    }

    dispatch(
      updateItem({
        key: task?.key,
        description: value,
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
    if (e.key === "Enter" && e.ctrlKey) {
      if (inEdit) {
        saveValue(tempValue);
        setInEdit(false);
      }
    }
  };

  const changeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTempValue(e.target.value);
  };

  // sync global state --> tempValue
  useEffect(() => {
    setTempValue(task?.description);
  }, [task?.description]);

  // auto focus on edit
  useEffect(() => {
    if (inEdit) {
      inputRef.current?.focus();
    }
  }, [inEdit]);

  console.log(task?.description?.split(/\r?\n/g));

  return (
    <div
      className="editable-field"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !inEdit && setInEdit(true)}
    >
      {!inEdit && (
        <div className="task-description">
          {(task?.description &&
            task.description.split(/\r?\n/g).map((j, i) => (
              <div
                className="description-block"
                key={`task-description-line-${i}`}
              >
                {j}
                <br />
              </div>
            ))) ||
            "No description"}
        </div>
      )}
      {inEdit && (
        <Input.TextArea
          ref={inputRef}
          value={tempValue || undefined}
          placeholder="No description"
          autoSize={{ minRows: 3, maxRows: 5 }}
          onKeyDown={keyDownHandler}
          onBlur={blurHandler}
          onChange={changeHandler}
        />
      )}
    </div>
  );
};
