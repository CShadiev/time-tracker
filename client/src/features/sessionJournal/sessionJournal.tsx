import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import { FC } from "react";
import { endOfDay, format, startOfDay } from "date-fns";
import { GroupedSessions, SessionJournalItem } from "./sessionJournalTypes";
import { getProjectsQuery } from "../../api/tasks";
import { findNode } from "../utils";
import {
  MenuItem,
  PanelMenuItem,
  Project,
  Task,
} from "../taskPanel/taskPanelTypes";
import { getSessionsQueryFn } from "../../api/sessions";

export const SessionJournal: FC = () => {
  const { data: sessions } = useQuery(
    ["sessions", { start: startOfDay(new Date()), end: endOfDay(new Date()) }],
    getSessionsQueryFn
  );
  const { data: projects } = useQuery(["projects"], getProjectsQuery);

  if (!sessions || !projects) return null;

  const sessionsByTask = sessions?.reduce((acc, session) => {
    if (!acc[session.task_id]) {
      const task = findNode(
        projects,
        (node: PanelMenuItem) => node.key === session.task_id
      ) as Task;
      const project = findNode(
        projects,
        (node: MenuItem) => node.key === task.project_id
      ) as Project;
      acc[session.task_id] = {
        project: project.label,
        task: task.label,
        sessions: [],
      };
    }
    acc[session.task_id].sessions.push(session);
    return acc;
  }, {} as GroupedSessions);

  const todayTotal = sessions?.reduce(
    (acc, session) => acc + Math.floor(session.duration / 60),
    0
  );

  return (
    <Card title={"Journal"}>
      <p>
        <b>Total minutes today: {todayTotal}</b>
      </p>
      {Object.entries(sessionsByTask).length === 0 && (
        <div className="placeholder">No sessions today</div>
      )}
      {Object.entries(sessionsByTask).map(([taskId, j]) => (
        <div key={taskId}>
          {j.task} ({j.project})
          <ul>
            {j.sessions.map((s) => (
              <li key={s.key}>
                {format(new Date(s.completed_at), "dd.MM HH:mm")} -{" "}
                {Math.floor(s.duration / 60)} min
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Card>
  );
};
