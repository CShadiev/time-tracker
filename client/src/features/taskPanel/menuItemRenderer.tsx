import {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ButtonAdd } from "./buttonAdd";
import { MenuItem } from "./taskPanelTypes";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import { Input, InputRef } from "antd";
import {
  renameItem,
  setRenamingItem,
} from "./taskPanelSlice";
import { ButtonRename } from "./buttonRename";
import { ButtonRemove } from "./buttonRemove";
import { labelValidator } from "./labelValidator";

export const MenuItemRenderer: FC<{
  item: MenuItem;
}> = (props) => {
  const { item } = props;
  const renamingItem = useAppSelector(
    (s) => s.taskPanel.renamingItem
  );
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const inputRef = useRef<InputRef>(null);
  const [inputValue, setInputValue] = useState(item.label);

  const saveNewLabel = useCallback(() => {
    if (labelValidator(inputValue)) {
      if (item.label !== inputValue) {
        dispatch(
          renameItem({
            key: item.key,
            label: inputValue,
          })
        );
      }
      dispatch(setRenamingItem(null));
    }
  }, [dispatch, inputValue, item.key, item.label]);

  const blurHandler = (e: React.FocusEvent) => {
    if (labelValidator(inputValue)) {
      saveNewLabel();
    } else {
      setInputValue(item.label);
      dispatch(setRenamingItem(null));
    }
  };

  useEffect(() => {
    if (item.key === renamingItem) {
      inputRef.current?.focus();
    }
  }, [item.key, renamingItem, item.label, inputRef]);

  // sync global state --> input value
  useEffect(() => {
    if (item.label) {
      setInputValue(item.label);
    }
  }, [item.label]);

  // save on 'enter'
  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (renamingItem) {
        // do not trigger menu
        e.stopPropagation();
        saveNewLabel();
      }
    }
  };

  return (
    <div
      className="menu-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={keyDownHandler}
    >
      <div className="menu-item-label">
        {item.key === renamingItem && (
          <Input
            ref={inputRef}
            value={inputValue}
            status={
              labelValidator(inputValue) ? "" : "error"
            }
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={blurHandler}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {item.key !== renamingItem && item.label}
      </div>
      <div
        className="menu-item-control"
        onClick={(e) => e.stopPropagation()}
      >
        {(isHovered || item.key === renamingItem) && (
          <ButtonRename
            itemKey={item.key}
            level={item.level}
          />
        )}
        {item.level !== "subtask" &&
          (isHovered || item.key === renamingItem) && (
            <ButtonAdd
              level={item.level}
              itemKey={item.key}
            />
          )}
        <span
          style={{
            display:
              isHovered || item.key === renamingItem
                ? "inline-flex"
                : "none",
          }}
        >
          <ButtonRemove
            itemKey={item.key}
            level={item.level}
          />
        </span>
      </div>
    </div>
  );
};
