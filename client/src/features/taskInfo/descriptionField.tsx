import { Input } from "antd";
import { FC, useRef, useState, useEffect } from "react";
import { Subtask, Task } from "../taskPanel/taskPanelTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyItemMutationFn } from "../../api/tasks";
import { descriptionValidator } from "./descriptionValidator";

type Props = {
  task: Task | Subtask;
};

export const DescriptionField: FC<Props> = (props) => {
  const { task } = props;
  const inputRef = useRef<any>(null);
  const [inEdit, setInEdit] = useState(false);
  const [tempValue, setTempValue] = useState(task?.description);
  const queryClient = useQueryClient();
  const modifyDescriptionMutation = useMutation({
    mutationFn: modifyItemMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", task?.key]);
    },
  });
  const validationResult = descriptionValidator(tempValue);

  const saveValue = (value: string | null | undefined) => {
    if (!task) {
      return;
    }

    const validationResult = descriptionValidator(value);
    if (!validationResult.isValid) {
      return;
    }

    // make sure we don't send the same value
    if (validationResult.value === task.description) {
      return;
    }

    modifyDescriptionMutation.mutate({
      key: task.key,
      level: task.level,
      description: validationResult.value,
    });
  };

  const blurHandler = (e: React.FocusEvent) => {
    if (inEdit) {
      setTempValue(task?.description);
      setInEdit(false);
    }
  };

  // save on 'ctrl + enter'
  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      if (inEdit) {
        // do not exit edit mode if validation fails
        if (validationResult.isValid) {
          saveValue(tempValue);
          setInEdit(false);
        }
      }
    } else if (e.key === "Escape") {
      if (inEdit) {
        setTempValue(task?.description);
        setInEdit(false);
      }
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <>
      <div
        className="editable-field"
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
              "Click here to edit description"}
          </div>
        )}
        {inEdit && (
          <Input.TextArea
            ref={inputRef}
            value={tempValue || undefined}
            placeholder="Click here to edit description"
            autoSize={{ minRows: 3, maxRows: 5 }}
            onKeyDown={keyDownHandler}
            onBlur={blurHandler}
            onChange={changeHandler}
            status={
              descriptionValidator(tempValue).isValid ? undefined : "error"
            }
          />
        )}
      </div>
      {inEdit && !validationResult.isValid && (
        <div
          className="danger"
          style={{
            marginTop: ".3rem",
            fontSize: "0.8rem",
            width: "100%",
            textAlign: "center",
          }}
        >
          {validationResult.validationError}
        </div>
      )}
    </>
  );
};
