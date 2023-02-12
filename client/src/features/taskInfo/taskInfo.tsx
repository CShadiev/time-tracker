import { Card, Divider } from "antd";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { TitleField } from "./titleField";
import { selectCurrentItem } from "../taskPanel/taskPanelSlice";
import { format } from "date-fns";
import { parseISO } from "date-fns/esm";
import { DescriptionField } from './descriptionField';

export const TaskInfo: React.FC = () => {
  const selectedTask = useAppSelector(selectCurrentItem);
  const createdAt =
    selectedTask && parseISO(selectedTask.created_at);

  return (
    <Card title="Current Task">
      {!selectedTask && <p>No task selected</p>}
      {selectedTask && (
        <div className={"task-info"}>
          <TitleField />
          <DescriptionField />
          <Divider />
          <div className="task-origin-dt">
            <div className={"info-group"}>
              <div className={"label"}>created</div>
              <div className={"value"}>
                {createdAt &&
                  format(createdAt, "MMM d, HH:mm")}
              </div>
            </div>
            <div className={"info-group"}>
              <div className={"label"}>completed</div>
              <div className={"value"}>
                {selectedTask.completed_at || "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
