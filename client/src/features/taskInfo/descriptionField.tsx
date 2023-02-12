import {
  FC,
  useCallback,
  useRef,
  useState,
  useEffect,
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

  return (
    <div
      className="editable-field"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!inEdit && (
        <div className="task-description">
          {task?.description}
        </div>
      )}
      {inEdit && <></>}
    </div>
  );
};
