import { Card, Divider } from "antd";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { TitleField } from "./titleField";
import { selectCurrentItem } from "../taskPanel/taskPanelSlice";
import { DescriptionField } from "./descriptionField";
import { ExpectedDurationInfo } from "./expectedDurationInfo";
import { useQuery } from "@tanstack/react-query";
import { apiBase } from "../../app/config";
import axios from "axios";
import { Subtask, Task } from "../taskPanel/taskPanelTypes";
import { format, parseISO } from "date-fns";

export const TaskInfo: React.FC = () => {
  const selectedTaskKey = useAppSelector(selectCurrentItem);
  const selectedLevel = useAppSelector((s) => s.taskPanel.selectedLevel);
  const { data: selectedTask, isSuccess } = useQuery(
    ["tasks", selectedTaskKey],
    async () => {
      const response = await axios.get(apiBase + `/tasks/${selectedTaskKey}/`);
      return response.data as Task | Subtask;
    },
    {
      enabled: !!selectedTaskKey && selectedLevel !== "project",
    }
  );

  const createdAt =
    selectedTask?.created_at && parseISO(selectedTask.created_at);

  return (
    <Card title="Current Task">
      {!selectedTask && <p>No task selected</p>}
      {isSuccess && selectedTask && (
        <div className={"task-info"}>
          <TitleField task={selectedTask} />
          <DescriptionField task={selectedTask} />
          <Divider />
          <div className="task-info-panel">
            <div className={"info-group"}>
              <div className={"label"}>created</div>
              <div className={"value"}>
                {createdAt && format(createdAt, "MMM d, HH:mm")}
              </div>
            </div>
            <div className={"info-group"}>
              <div className={"label"}>completed</div>
              <div className={"value"}>
                {selectedTask.completed_at || "N/A"}
              </div>
            </div>
            <ExpectedDurationInfo task={selectedTask} />
          </div>
        </div>
      )}
    </Card>
  );
};
