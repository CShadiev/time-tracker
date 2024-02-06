import { Card } from "antd";
import { FC } from "react";
import { format } from "date-fns";
import { GroupedSessions } from "./sessionJournalTypes";
import { useSessions } from "./useSessionsHook";

export const SessionJournal: FC = () => {
  const sessions = useSessions();

  if (!sessions) return null;

  const sessionsByTask = sessions?.reduce((acc, session) => {
    if (!acc[session.task_id]) {
      acc[session.task_id] = {
        project: session.project,
        task: session.task,
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
