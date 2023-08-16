import { FC, useEffect, useRef, useState } from "react";
import { ButtonAdd } from "./buttonAdd";
import { PanelMenuItem } from "./taskPanelTypes";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Input, InputRef } from "antd";
import { setRenamingItem } from "./taskPanelSlice";
import { ButtonRename } from "./buttonRename";
import { ButtonRemove } from "./buttonRemove";
import { labelValidator } from "../taskInfo/labelValidator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyItemMutationFn } from "../../api/tasks";

/**Renders projects, tasks, and subtasks in the menu panel.
 * Handles renaming, adding, and removing items.
 */
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
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 32) {
      setInputValue(e.target.value);
    }
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
            onChange={inputChangeHandler}
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
