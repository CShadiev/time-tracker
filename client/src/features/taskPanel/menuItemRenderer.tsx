import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ButtonAdd } from "./buttonAdd";
import { MenuItem, PanelMenuItem } from "./taskPanelTypes";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Input, InputRef } from "antd";
import { renameItem, setRenamingItem } from "./taskPanelSlice";
import { ButtonRename } from "./buttonRename";
import { ButtonRemove } from "./buttonRemove";
import { labelValidator } from "./labelValidator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyItemMutationFn } from "../../api/tasks";
import { eventManager } from "react-toastify/dist/core";

export const MenuItemRenderer: FC<{
  item: PanelMenuItem;
}> = (props) => {
  const { item } = props;
  const queryClient = useQueryClient();
  const renameItemMutation = useMutation({
    mutationFn: modifyItemMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });
  const renamingItem = useAppSelector((s) => s.taskPanel.renamingItem);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const inputRef = useRef<InputRef>(null);
  const [inputValue, setInputValue] = useState(item.label);

  const saveNewLabel = (inputValue: string, key: string) => {
    if (inputValue) {
      if (item.label !== inputValue) {
        renameItemMutation.mutate({
          level: item.level,
          key: key,
          label: inputValue,
        });
      }
      dispatch(setRenamingItem(null));
    }
  };
  const blurHandler = (e: React.FocusEvent) => {
    // reset value to original
    setInputValue(item.label);
    dispatch(setRenamingItem(null));
  };

  // focus input on rename
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

  // key down handler
  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (renamingItem) {
        // do not trigger menu
        e.stopPropagation();
        const validatedVal = labelValidator(inputValue);
        console.log(validatedVal);
        if (validatedVal && validatedVal !== item.label) {
          setInputValue(validatedVal);
          saveNewLabel(validatedVal, item.key);
        } else {
          setInputValue(item.label);
          dispatch(setRenamingItem(null));
        }
      }
    }
    if (e.key === "Escape") {
      dispatch(setRenamingItem(null));
      setInputValue(item.label);
    }
    e.stopPropagation();
  };

  let projectKey;
  if (item.level === "project") {
    projectKey = item.key;
  } else {
    projectKey = item.project_id;
  }

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
            status={labelValidator(inputValue) ? "" : "error"}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={blurHandler}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {item.key !== renamingItem && item.label}
      </div>
      <div className="menu-item-control" onClick={(e) => e.stopPropagation()}>
        {(isHovered || item.key === renamingItem) && (
          <ButtonRename itemKey={item.key} level={item.level} />
        )}
        {item.level !== "subtask" &&
          (isHovered || item.key === renamingItem) && (
            <ButtonAdd
              level={item.level}
              parentKey={item.key}
              projectKey={projectKey}
            />
          )}
        <span
          style={{
            display:
              isHovered || item.key === renamingItem ? "inline-flex" : "none",
          }}
        >
          <ButtonRemove itemKey={item.key} level={item.level} />
        </span>
      </div>
    </div>
  );
};
