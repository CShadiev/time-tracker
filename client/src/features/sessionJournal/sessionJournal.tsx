import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import { FC } from "react";
import { apiBase } from "../../app/config";
import { endOfDay, format, startOfDay } from "date-fns";
import axios from "axios";
import { GroupedSessions, SessionJournalItem } from "./sessionJournalTypes";
import { getProjectsQuery } from "../../api/tasks";
import { findNode } from "../utils";
import {
  MenuItem,
  PanelMenuItem,
  Project,
  Task,
} from "../taskPanel/taskPanelTypes";

export const SessionJournal: FC = () => {
  const { data: sessions } = useQuery(["sessions"], async () => {
    const resp = await axios.post(apiBase + "/session/", {
      ts_start: startOfDay(new Date()).toISOString(),
      ts_end: endOfDay(new Date()).toISOString(),
    });
    return resp.data as SessionJournalItem[];
  });
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

  return (
    <Card
      title={"Journal"}
      style={{
        marginTop: "1rem",
      }}
    >
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
